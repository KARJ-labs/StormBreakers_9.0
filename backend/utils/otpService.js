const sendotp = require("./sendmail");
const User = require("../model/authmodel");

const SendOtp = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.getUserByEmail(email);

  if (!user || user.error) {
    throw new Error("User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otp_expire_at = new Date(Date.now() + 5 * 60 * 1000);

  const update = await User.updateOtp({
    email,
    otp,
    otp_expire_at,
  });

  if (!update || update.error) {
    throw new Error("Failed to generate OTP");
  }

  await sendotp(email, otp);
};

module.exports = { SendOtp };
