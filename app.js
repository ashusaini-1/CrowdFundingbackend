const express=require("express");
const app=express();
const user=require('./routes/userRoutes')
const campaign=require('./routes/campaignRoutes')
const payment=require('./routes/paymentRoutes')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1',user);
app.use('/api/v1/',campaign);

app.get('/api/getKey',(req,res)=>{
    res.status(200).json({
        key:process.env.RAZORPAY_API_KEY
    })
})
module.exports=app;