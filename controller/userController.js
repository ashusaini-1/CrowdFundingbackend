const User = require("../models/userModel");
const { sendToken } = require("../utils/jwtToken");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorHandler");

module.exports.registerUser = async (req, res, next) => {
  const { name, email, contact, password } = req.body;

  if (!name || !email || !contact || !password) {
    return next(new ErrorHandler("Please Enter all the Details", 401));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
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

module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
};

// Get User Detail
exports.getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
};

module.exports.allUser = async (req, res) => {
  try {
    const resultPerPage = 10;
    const page = req.query.page || 1; // Get the page number from the query parameters
    const searchTerm = req.query.name || ""; // Get the title search term from the query parameters

    const initialQuery = User.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    // Get the total count of campaigns matching the search term
    const userCount = await User.countDocuments({
      title: { $regex: searchTerm, $options: "i" },
    });

    // Create an instance of ApiFeatures with the initial query
    const apiFeature = new ApiFeatures(initialQuery, req.query).filter();

    // Apply pagination
    apiFeature.pagination(resultPerPage, page);

    // Execute the query once
    const users = await apiFeature.query;

    const filteredCampaignCount = users.length;

    res.status(200).json({
      success: true,
      users,
      userCount,
      resultPerPage,
      filteredCampaignCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching campaigns",
    });
  }
};

module.exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};
