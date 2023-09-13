const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

const ErrorHandler = require("../utils/errorHandler");

module.exports.registerUser = async (res, res, next) => {
  const { name, email, contact, password } = req.body;

  if (!name || !email || !contact || !password) {
    return next(new ErrorHandler("Please Enter all the Details", 401));
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    re.status(409).json({
      success: false,
      message: "User allready exists",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    contact,
  });

  sendToken(user, 200, res);
};

module.exports.loginUser = async (res, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched=await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
};

module.exports.logout=async(req,res)=>{
res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true,
})
res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};