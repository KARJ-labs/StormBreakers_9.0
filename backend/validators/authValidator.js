const validateRegister = (req) => {
  const { name, email, phonenumber, password } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return {
      valid: false,
      statusCode: 400,
      message: "Name must contain at least 2 characters.",
    };
  }

  if (name.trim().length > 100) {
    return {
      valid: false,
      statusCode: 400,
      message: "Name is too long.",
    };
  }

  if (!email || typeof email !== "string") {
    return {
      valid: false,
      statusCode: 400,
      message: "Email is required.",
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    return {
      valid: false,
      statusCode: 400,
      message: "Invalid email address.",
    };
  }

  if (!phonenumber || typeof phonenumber !== "string") {
    return {
      valid: false,
      statusCode: 400,
      message: "Phone number is required.",
    };
  }

  const phonePattern = /^[0-9]{10}$/;

  if (!phonePattern.test(phonenumber.trim())) {
    return {
      valid: false,
      statusCode: 400,
      message: "Phone number must contain exactly 10 digits.",
    };
  }

  if (!password || typeof password !== "string") {
    return {
      valid: false,
      statusCode: 400,
      message: "Password is required.",
    };
  }

  if (password.length < 8) {
    return {
      valid: false,
      statusCode: 400,
      message: "Password must contain at least 8 characters.",
    };
  }

  return true;
};

const validateLogin = (req) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    return {
      valid: false,
      statusCode: 400,
      message: "Email is required.",
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    return {
      valid: false,
      statusCode: 400,
      message: "Invalid email address.",
    };
  }

  if (!password || typeof password !== "string") {
    return {
      valid: false,
      statusCode: 400,
      message: "Password is required.",
    };
  }

  return true;
};

const validateForgotPassword = (req) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return {
      valid: false,
      statusCode: 400,
      message: "Email is required.",
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    return {
      valid: false,
      statusCode: 400,
      message: "Invalid email address.",
    };
  }

  return true;
};

const validateResetPassword = (req) => {
  const { newpassword } = req.body;

  if (!newpassword || typeof newpassword !== "string") {
    return {
      valid: false,
      statusCode: 400,
      message: "New password is required.",
    };
  }

  if (newpassword.length < 8) {
    return {
      valid: false,
      statusCode: 400,
      message: "New password must contain at least 8 characters.",
    };
  }

  return true;
};

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};
