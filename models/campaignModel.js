const mongoose = require("mongoose");

// Define the Campaign Schema
const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  fundingGoal: {
    type: Number,
    required: true,
    min: 1, // Ensure the goal is a positive number
  },
  endDate: {
    type: Date,
    required: true,
  },
  pic: {
    type: "String",
  },
  category: {
    type: String,
    enum: ["Arts", "Technology", "Charity"], // Define allowed categories
    required: true,
  },
  // creator: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // Reference to the User model (assuming you have a User model)
  //   required: true,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Campaign model
const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
