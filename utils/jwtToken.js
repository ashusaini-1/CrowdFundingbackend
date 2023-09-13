const sendToken = async (user, statusCode, res) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
