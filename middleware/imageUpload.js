const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage}=require("multer-storage-cloudinary");
const multer=require('multer');




const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
      folder:"products",
      format :async()=>"png",
      public_id:(req,file)=>file.filename
    }
  })
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  
  const parser=multer({storage:storage});

  module.exports=parser
