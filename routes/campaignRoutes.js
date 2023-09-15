const express=require("express");
const router=express.Router();
const { createCampaign, updateCampaign, deleteCamapign, singleCamapign, allCamapign }=require("../controller/campaignController")
router.route('/register/campaign').post(createCampaign);
router.route('/update/campaign/:id').put(updateCampaign);
router.route('/delete/campaign/:id').delete(deleteCamapign);
router.route('/campaign/detail/:id').get(singleCamapign);
router.route('/view/campaign').get(allCamapign);

module.exports=router;