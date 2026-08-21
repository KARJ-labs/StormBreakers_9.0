const User = require("../model/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.id).select(
      "name email phonenumber profile_picture auth_provider is_verified",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phonenumber: user.phonenumber,
        profile_picture: user.profile_picture,
        auth_provider: user.auth_provider,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

module.exports = {
  getProfile,
};