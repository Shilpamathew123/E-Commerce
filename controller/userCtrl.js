// controller/userCtrl.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { generateToken } = require('../config/jwtToken');

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        // Create new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        res.status(400).json({
            msg: "User already exists",
            success: false,
        });
    }
});

const loginUserCtrl=asyncHandler(async(req,res)=>{
    const{email,password}=req.body;
    //check if user already exists or not
    const findUser=await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
       res.json({
        _id: findUser._id,
        firstname: findUser.firstname,
        lastname: findUser.lastname,
        email: findUser.email,
        mobile: findUser.mobile,
        token: generateToken(findUser._id)
    });
} else{
        res.status(400).json({
            msg: "Invalid email or password",
            success: false,
        });
    }
});

module.exports = { createUser,loginUserCtrl }; // Make sure it's an object with createUser
  

