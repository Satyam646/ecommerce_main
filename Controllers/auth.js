    
    const jwt= require("jsonwebtoken"); // to generate signed token
    // const expressJwt= require("express-jwt");// for authorization check
    const express = require('express');

    const { expressjwt } = require('express-jwt');
    const User = require('../Models/users');
    require('dotenv').config();
    exports.signup=async (req,res)=>{
        console.log("req.body",  req.body);
        try{
        const user = new User(req.body);
        const savedUser = await user.save(); // Use await to handle the promise
        savedUser.hashed_password=undefined; // not need we to enter this use virtual password there
        savedUser.salt=undefined;
        res.status(201).send(savedUser);
        } catch (error) {
            // error
        res.status(500).send(error.errorResponse);
        }
        };
    // user.save((err,res)=>{
    //     if(err){
           
    //     }
    //     res.json({
    //           user
    //     });
    // });
    // this save method is use to save our request body to our database.
    // exports.signin=(req,res)=>{
         
    //     const { email,password}= req.body;
    //     User.findOne({email},(err , user)=>{
    //            if(err||!user){
    //             return res.status(400).json({
    //                 error:"User with that Email doesn exist, Please signup",
    //             });
    //            }
    //            //if user found make sure to match email and password
    //            //if email is found make sure that password is matched for that we have to authenticate user
    //              if(!user.authenticate(password)){
    //                 return res.status(401).json({
    //                     error:"Email_id and password doesnot match"
    //                 })
    //              }
    //            //let suppose password also matched
    //            //we to generate sigined token to send back to frontend client
    //            const token = jwt.sign({_id:user._id},process.env.JWT_SECRET)
    //            //persist token as 't' in cookie with expire date
    //            res.cookie('t',token,{expire:new Date() + 9999})  //new date sets new date and 9999 is added to add that much time to that for expiry
    //            // return user and token to frontend client
    //            const {_id,name,email,role} = user
    //            return res.status(200).json({token, user:{_id,email,name,role}})
    //     })
    // }
    exports.signin = async (req, res) => {
        
        
        try {
            const { email, password } = req.body;
            // Use async/await instead of callbacks
            const user = await User.findOne({ email });
            
            if (!user) {
                return res.status(400).json({
                    error: "User with that Email doesn't exist, Please signup",
                });
            }
    
            // Authenticate the user by comparing password
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: "Email and password do not match"
                });
            }
    
            // Generate signed JWT token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET); // Expiring in 1 hour
    
            // Set the token in a cookie, with an expiry of 1 day
            res.cookie('t', token, { expire: new Date(Date.now() + 24 * 60 * 60 * 1000) });  // 1 day expiry
            
            // Return user and token to frontend
            const { _id, name,  role } = user;
            return res.status(200).json({
                token,
                user: { _id, email, role,name }
            });
        } catch (err) {
            console.error(err); // Log the error for debugging
            return res.status(500).json({
                error: "Server error. Please try again later."
            });
        }
    };
    exports.signout=(req,res)=>{
        res.clearCookie('t');
        res.status(200).json({
            message:"signout successfully"
        })
    }
    //requiresignin is a middleware.
    exports.requireSignin = expressjwt({
        secret: process.env.JWT_SECRET,
        algorithms: ["HS256"],
        userProperty: "auth"
    });

    exports.isAuth = (req,res,next) => {
        console.log(req.profile._id);
        console.log(req.auth._id);
        let user = req.profile&&req.auth&&(req.profile._id == req.auth._id); // req.auth gives data of the user like id ,role etc who is currently login with the help of autherised token and if with that other user cannot access feature with use of token generated. 
        if (!user){
            return res.status(403).json({
                error:"Acess Denied"
            })
        }
        next();
    }
    exports.isAdmin = (req,res,next) => {
        if(req.profile.role === 0){
            return res.status(403).json ({
                error: "Admin resource !Acess Denied"
            })
        }
        next();
    }
    
    

