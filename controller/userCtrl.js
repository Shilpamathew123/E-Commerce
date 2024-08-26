// controller/userCtrl.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { generateToken } = require('../config/jwtToken');
//create 
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
//login a user
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

//update user
const updateUser=asyncHandler(async(req,res)=>{
    const id = req.params.id;
    try{
        const updateUser=await User.findByIdAndUpdate(id,{
            firstname:req?.body.firstname,
            lastname:req?.body.lastname,
            email:req?.body.email,
            mobile:req?.body.mobile,
        },{new:true,});
        res.json(updateUser);
    }
    catch(error){
        throw new Error(error);
    }
  
})
//get all users
const getallUser=asyncHandler(async(req,res)=>{
   try{
        const getUsers=await User.find({});
        res.json(getUsers);
   }
   catch(error){
    throw new Error(error);

   }
})
//get single user

const getaUser=asyncHandler(async(req,res)=>{
    const id = req.params.id;
   try{
        const getaUser=await User.findById(id)
        res.json({getaUser})
   }
   catch(error){
    throw new Error(error);
   }
})

//delete user
const deleteUser=asyncHandler(async(req,res)=>{
    const id = req.params.id;
   try{
        const deleteUser=await User.findByIdAndDelete(id)
        res.json({deleteUser})
   }
   catch(error){
    throw new Error(error);
   }
})

module.exports = { createUser,loginUserCtrl,getallUser,getaUser,deleteUser,updateUser }; // Make sure it's an object with createUser
  

