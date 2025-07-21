
const jwt = require("jsonwebtoken"); // to generate signed token
// const expressJwt= require("express-jwt");// for authorization check
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("138079214967-krcqb0pamcehpenmqb6t7cjice8u2nrb.apps.googleusercontent.com");
const { expressjwt } = require('express-jwt');
const User = require('../Models/users');
require('dotenv').config();
exports.signup = async (req, res) => {
    console.log("req.body", req.body);
    try {
        const user = new User(req.body);
        const savedUser = await user.save(); // Use await to handle the promise
        savedUser.hashed_password = undefined; // not need we to enter this use virtual password there
        savedUser.salt = undefined;
        res.status(200).send(savedUser);
    } catch (error) {
        // error
        res.status(500).send(error.errorResponse);
    }
};
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Use async/await instead of callbacks
        const user = await User.findOne({ email });
        console.log(user);
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
        const { _id, name, role } = user;
        return res.status(200).json({
            token,
            user: { _id, email, role, name }
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({
            error: "Server error. Please try again later."
        });
    }
};
exports.signout = (req, res) => {
    res.clearCookie('t');
    res.status(200).json({
        message: "signout successfully"
    })
}
//requiresignin is a middleware.
exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
});
exports.isAuth = (req, res, next) => {
    console.log(req.profile._id);
    console.log(req.auth._id);
    let user = req.profile && req.auth && (req.profile._id == req.auth._id); // req.auth gives data of the user like id ,role etc who is currently login with the help of autherised token and if with that other user cannot access feature with use of token generated. 
    if (!user) {
        return res.status(403).json({
            error: "Acess Denied"
        })
    }
    next();
}
exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Admin resource !Acess Denied"
        })
    }
    next();
}
async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "138079214967-krcqb0pamcehpenmqb6t7cjice8u2nrb.apps.googleusercontent.com",
    });
    return ticket.getPayload();
}
exports.googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const payload = await verifyGoogleToken(token);
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            const newUser = new User({
                name: payload.name,
                email: payload.email,
                password: payload.sub,  // or handle this better
                role: 0
            });
            try {
                await newUser.save();
                user = newUser;
            } catch (error) {
                console.error("User creation failed:", error);
                return res.status(500).json({ error: "User creation failed." });
            }
        }
        // Directly generate JWT without password check for Google Sign-In
        const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie('t', jwtToken, { expire: new Date(Date.now() + 24 * 60 * 60 * 1000) });
        const { _id, name, email, role } = user;
        return res.status(200).json({
            token: jwtToken,
            user: { _id, email, role, name }
        });
    } catch (err) {
        console.error("Google Login Error:", err);
        return res.status(401).json({ error: "Invalid Google token or server error." });
    }
};
