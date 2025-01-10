const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");  // bodyParser is used to 
const morgan = require("morgan");  // morgan is used to log routes
const cookieParser = require("cookie-parser");
require("dotenv").config();
const router=require("./routes/users");
const app=express();
//To connect the database.
mongoose.connect(process.env.DATABASE,{
        //  useNewUrlParser:true,
        //  useUnifiedTopology: true
}).then(()=>console.log("database is connected now"))
//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
//routes
// routes middle ware
app.use('/',router);// this will be prefix for all the router inside the router components
const port=process.env.PORT||8000;
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});