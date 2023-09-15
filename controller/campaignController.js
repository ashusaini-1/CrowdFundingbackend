const Campaign = require("../models/campaignModel");

module.exports.createCampaign = async (req, res) => {
  const { title, description, fundingGoal, endDate, category } = req.body;

  // const creator = req.user._id;
  const campaign = await Campaign.create({
    title,
    description,
    fundingGoal,
    endDate,
    category,
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
  const campaign=await Campaign.find();
  res.status(200).json({
    success: true,
    campaign
  });
};



module.exports.singleCamapign = async (req, res) => {
  const campaign=await Campaign.findById(req.params.id);
  res.status(200).json({
    success: true,
    campaign
  });
};


module.exports.deleteCamapign = async (req, res) => {
  await Campaign.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "campaign deleted successfully",
  });
};
