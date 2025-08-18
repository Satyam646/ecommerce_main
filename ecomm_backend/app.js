const express=require("express");
const { check, validationResult } = require('express-validator');
const cors = require('cors');
const mongoose=require("mongoose");
// const expressValidator=require("express-validator");
const bodyParser=require("body-parser");  // bodyParser is used to 
const morgan = require("morgan");  // morgan is used to log routes
const cookieParser = require("cookie-parser");
require("dotenv").config();
const  authrouter =require("./routes/auth");
const  userrouter=require("./routes/user");
const  productRoutes=require("./routes/product");
const  categoryRoutes=require("./routes/category");
const  brainTreeRoutes = require("./routes/Braintree");
const SalesTracking = require("./routes/SalesTracking");
const Bot = require("./routes/ChatBot")
const orders = require('./routes/order')
const app=express();
//To connect the database.
mongoose.connect(process.env.DATABASE,{
         // useNewUrlParser:true,
         // useUnifiedTopology: true
}).then(()=>console.log("database is connected now"))
//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors()); // it enables our api to handle cross origin request
// app.use(expressValidator()); // in newer version we donot declare expressvalidator globally.
//routes
// routes middle ware
app.use('/',authrouter);// this will be prefix for all the router inside the router components
app.use('/',userrouter);
app.use('/',categoryRoutes);
app.use('/',productRoutes);
app.use("/",brainTreeRoutes);
app.use("/",orders);
app.use("/",SalesTracking);
app.use("/",Bot);
const port=process.env.PORT||8080;
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});
