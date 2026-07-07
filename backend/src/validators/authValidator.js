const validRegister = (username, email, password) => {
  if (username.length < 3 || username.length > 30)
    return { success: false, msg: "username must be between 3 and 30" };

  if (password.length < 8)
    return { success: false, msg: "password must alleast 8 character" };

  if (!/[a-zA-Z]/.test(password))
    return { success: false, msg: "password must have atleast one letter" };

  if (!/\d/.test(password))
    return { success: false, msg: "password must have atleast one number" };

  if (!/[^a-zA-Z0-9]/.test(password))
    return {
      success: false,
      msg: "password must have atleast one special character",
    };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { success: false, msg: "Invalied email, try again" };

  return { success: true, msg: "pass vaildation" };
};

module.exports = validRegister;
