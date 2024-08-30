// controller/userCtrl.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { generateToken } = require('../config/jwtToken');
const validateMongoDbId = require('../utils/validateMongodbid');
const { generateRefreshToken } = require('../config/refreshtoken');
const jwt = require('jsonwebtoken');

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
        const refreshToken = generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        }, { new: true });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 72,
        });
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
//handle refresh token
const handleRefreshToken=asyncHandler(async(req,res)=>{
const cookie=req.cookies;
console.log(cookie);
if(!cookie?.refreshToken)throw new Error('No refresh token provided');
const refreshToken=cookie.refreshToken;

const user=await User.findOne({refreshToken});
if(!user) throw new Error('Invalid refresh token');
jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,decode)=>{
if(err ||user.id !==decode?.id){throw new Error('Invalid refresh token')

} const accessToken = generateToken(user?._id);
res.json({accessToken})
})
res.json(user);
})
//logout user
const logoutUser=asyncHandler(async(req,res)=>{
    const cookie=req.cookies;
    if(!cookie?.refreshToken) throw new Error('No refresh token provided');
    const refreshToken=cookie.refreshToken;
    const user=await User.findOne({refreshToken});
    if(!user){
        res.clearCookie('refreshToken',{
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate({_id:user}, {
        refreshToken:refreshToken,
    });
    res.clearCookie('refreshToken',{
        httpOnly: true,
        secure: true,
    });
     res.sendStatus(204)
})

//update user
const updateUser=asyncHandler(async(req,res)=>{
    console.log();
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const updateUser=await User.findByIdAndUpdate(_id,{
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
    validateMongoDbId(id);
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
    validateMongoDbId(id);
   try{
        const deleteUser=await User.findByIdAndDelete(id)
        res.json({deleteUser})
   }
   catch(error){
    throw new Error(error);
   }
})
const blockUser=asyncHandler(async(req,res)=>{
    const id = req.params.id;
    validateMongoDbId(id);
   try{
        const block= await User.findByIdAndUpdate(id,{
            isBlocked:true,
        },
        {
            new:true,

        }
    );
    res.json({
        message:"User blocked",
    });
}
   
   catch(error){
    throw new Error(error);
   }
})

const unblockUser=asyncHandler(async(req,res)=>{
    const id = req.params.id;
    validateMongoDbId(id);
    try{
         const unblock= await User.findByIdAndUpdate(id,{
             isBlocked:false,
         },
         {
             new:true,
 
         }
     );
     res.json({
         message:"User Unblocked",
     });
 }
    
    catch(error){
     throw new Error(error);
    }
 })

 const updatePassword=asyncHandler(async(req, res, next)=>{
    console.log(req.body)

    const{_id}=req.user;
    const {password}=req.body;
    validateMongoDbId(_id);
    const user=await User.findById(_id);
    if(user&&password){
        user.password=password;
        const updatedPassword=await user.save()
        res.json(updatedPassword);
    }
    else{
        res.json(user)
    }
 })


 const forgotPasswordToken=asyncHandler(async(req,res,next)=>{
    const {email}=req.body.email;
    console.log("Email provided:", email);
    const user=await User.findOne({email});
    if(!user)throw new Error('User not found')
        try{
   const token=await user.createPasswordResetToken();
   await user.save()
   const resetURL=`Hi,please folow this link to reset your password.this link is valid till 10min from now.<a href='https:localhost:4000/api/usr/reset-password/${token}'>Click Here</a>`
    const data={
        to:email,
        text:"Hey User",
        subject:"forgot password link",
        html:resetURL,
    }
    await sendEmail(data)
    res.json({ message: 'Password reset link sent to your email', token })
}catch{
       throw new Error("Couldn't send email")
    }


 })
 


module.exports = { 
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteUser,
    updateUser,
blockUser,
unblockUser ,
handleRefreshToken,
logoutUser,
updatePassword,
forgotPasswordToken}; // Make sure it's an object with createUser
  

