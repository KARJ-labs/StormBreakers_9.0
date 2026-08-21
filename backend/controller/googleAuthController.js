const jwt = require("jsonwebtoken");
const { google } = require("googleapis");

const googleOAuth2Client = require("../config/googleOauth");
const User = require("../model/authmodel");

exports.googleLogin = (req, res, next) => {
  try {
    const authorizationUrl = googleOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      prompt: "select_account",
    });

    return res.redirect(authorizationUrl);
  } catch (err) {
    console.error("Google login error:", err);
    next(err);
  }
};

exports.googleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Google authorization code is missing.",
      });
    }

    const { tokens } = await googleOAuth2Client.getToken(code);

    if (!tokens.id_token) {
      return res.status(401).json({
        success: false,
        error: "Google authentication failed.",
      });
    }

    const ticket = await googleOAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: "Invalid Google account information.",
      });
    }

    const googleId = payload.sub;
    const email = payload.email?.toLowerCase();
    const name = payload.name;
    const picture = payload.picture;
    const emailVerified = payload.email_verified;

    if (!googleId || !email) {
      return res.status(400).json({
        success: false,
        error: "Google account information is incomplete.",
      });
    }

    if (!emailVerified) {
      return res.status(401).json({
        success: false,
        error: "Your Google email address is not verified.",
      });
    }

    let user = await User.getUserByGoogleId(googleId);

    if (user?.error) {
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve Google account.",
      });
    }

    if (!user) {
      const existingUser = await User.getUserByEmail(email);

      if (existingUser?.error) {
        user = await User.createGoogleUser({
          name: name || "Google User",
          email,
          google_id: googleId,
          profile_picture: picture || null,
        });

        if (user?.error) {
          return res.status(500).json({
            success: false,
            error: "Failed to create Google account.",
          });
        }
      } else {
        user = existingUser;

        user.google_id = googleId;
        user.profile_picture = picture || user.profile_picture;
        user.is_verified = true;

        await user.save();
      }
    }

    const userId = String(user._id);

    const token = jwt.sign(
      {
        id: userId,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      },
    );

    const refreshToken = jwt.sign(
      {
        id: userId,
        email: user.email,
      },
      process.env.REFRESH_KEY,
      {
        expiresIn: "7d",
      },
    );

    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.cookie("refreshtoken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${process.env.FRONTEND_URL}/oauth2/success`);
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    next(err);
  }
};
