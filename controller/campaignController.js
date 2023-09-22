const Campaign = require("../models/campaignModel");
const twilio = require("twilio");
const User = require("../models/userModel");
const ApiFeatures = require("../utils/apifeatures");
const { parsePhoneNumberFromString } = require("libphonenumber-js");

module.exports.createCampaign = async (req, res) => {
  const { title, description, fundingGoal, endDate, category, pic } = req.body;
  const campaign = await Campaign.create({
    title,
    description,
    fundingGoal,
    endDate,
    category,
    pic,
  });

  res.status(200).json({
    success: true,
    campaign,
  });
};

module.exports.updateCampaign = async (req, res) => {
  const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!campaign) {
    return res.status(404).json({ error: "Campaign not found" });
  }

  res.status(200).json({ campaign });
};

module.exports.allCamapign = async (req, res) => {
  try {
    const resultPerPage = 10;
    const page = req.query.page || 1; // Get the page number from the query parameters
    const searchTerm = req.query.title || ""; // Get the title search term from the query parameters

    // Construct the initial query with the title search term
    const initialQuery = Campaign.find({
      title: { $regex: searchTerm, $options: "i" },
    });

    // Get the total count of campaigns matching the search term
    const campaignCount = await Campaign.countDocuments({
      title: { $regex: searchTerm, $options: "i" },
    });

    // Create an instance of ApiFeatures with the initial query
    const apiFeature = new ApiFeatures(initialQuery, req.query).filter();

    // Apply pagination
    apiFeature.pagination(resultPerPage, page);

    // Execute the query once
    const campaign = await apiFeature.query;

    const filteredCampaignCount = campaign.length;

    res.status(200).json({
      success: true,
      campaign,
      campaignCount,
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

module.exports.singleCamapign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  res.status(200).json({
    success: true,
    campaign,
  });
};

module.exports.deleteCamapign = async (req, res) => {
  await Campaign.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "campaign deleted successfully",
  });
};

exports.sendSMSToSingleUser = async (req, res) => {
  try {
    // Twilio Account SID and Auth Token (replace with your actual values)
    const accountSid = "ACd6f9da3c0ea5b6d279fff29d8a5a89fc";
    const authToken = "3295971542b6984e6681acfeadf328dd";

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    const users = await User.find(); // You may need to adjust this query based on your user model

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    // Message to send
    const message = "Hello from Twilio! This is a test message.";
    for (const user of users) {
      try {
        // Parse the phone number and format it to E.164
        const phoneNumber = parsePhoneNumberFromString(user.contact, "IN");
        const formattedPhoneNumber = phoneNumber
          ? phoneNumber.format("E.164")
          : null;

        if (formattedPhoneNumber) {
          await client.messages.create({
            body: message,
            to: formattedPhoneNumber,
            from: "+12565989131", // Your Twilio phone number
          });
          console.log(`Message sent to ${formattedPhoneNumber}`);
        } else {
          console.error(`Invalid phone number for user ${user._id}`);
        }
      } catch (error) {
        console.error(`Error sending message to ${user.contact}:`, error);
      }
    }

    res.status(200).json({ message: "SMS sent to the user." });
  } catch (error) {
    console.error("Error sending SMS to the user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
