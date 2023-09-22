const express = require("express");
const router = express.Router();

const {
  createCampaign,
  updateCampaign,
  deleteCamapign,
  singleCamapign,
  allCamapign,
  sendSMSToSingleUser
} = require("../controller/campaignController");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/register/campaign").post(isAuthenticatedUser,createCampaign);
router.route("/update/campaign/:id").put(isAuthenticatedUser,updateCampaign);
router.route("/delete/campaign/:id").delete(isAuthenticatedUser,deleteCamapign);
router.route("/campaign/detail/:id").get(singleCamapign);
router.route("/view/campaign").get(allCamapign);
router.route('/send').post(isAuthenticatedUser,sendSMSToSingleUser);

module.exports = router;
