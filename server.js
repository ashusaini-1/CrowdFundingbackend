
const dotenv=require('dotenv');
const app=require('./app');

const connectDatabase=require("./config/db")


dotenv.config({path:"config/config.env"});

connectDatabase();

const PORT=process.env.PORT || 5500
app.listen(PORT,()=>{
console.log(`Server is running on this Port: ${PORT}`)


});


