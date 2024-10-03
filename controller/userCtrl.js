const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon=require('../models/couponModel')
const Order=require("../models/orderModel");
const uniqid = require('uniqid');


const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");

// Create a User ----------------------------------------------

const createUser = asyncHandler(async (req, res) => {
  /**
   * TODO:Get the email from req.body
   */
  const email = req.body.email;
  /**
   * TODO:With the help of email find the user exists or not
   */
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    /**
     * TODO:if user not found user create a new user
     */
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    /**
     * TODO:if user found then thow an error: User already exists
     */
    throw new Error("User Already Exists");
  }
});

// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// admin login

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }

});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout functionality

const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

// Update a user

const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// save user Address

const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all users

const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find().populate("wishlist");
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockusr);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishList=asyncHandler(async(req,res)=>{
  const {_id}=req.user;

  try{
    const findUser=await User.findById(_id).populate('wishlist');
    res.json(findUser);

  }
  catch(error){
    throw new Error(error);
  }
})

const userCart=asyncHandler(async(req,res)=>{
  const {cart}=req.body;
  const {_id} =req.user;
  validateMongoDbId(_id);

  try{
    let products=[];
    const user=await User.findById(_id).populate('cart');
    //if user already have products in cart
    const alreadyExistCart=await Cart.findOne({orderby:user._id})
    if(alreadyExistCart){
      alreadyExistCart.remove();
     
    }
    for(let i=0;i<cart.length;i++){
      let object={};
      object.product=cart[i]._id;
      object.quantity=cart[i].quantity;
      object.color=cart[i].color;
      let getProduct=await Product.findById(cart[i]._id).select('price').exec();
      object.price=getProduct.price;
      products.push(object);

    }
    let cartTotal=0;
    for(let i=0; i<products.length; i++){
      cartTotal+=products[i].price*products[i].quantity;
    }
      console.log(products,cartTotal,);
      let newCart=await new Cart({
        products,
        cartTotal,
        orderby:_id,
        status:'pending'
      }).save();
      res.json(newCart);
    }
  catch(error){
    throw new Error(error);
  }


})

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body; // Get product ID and quantity from the request body
  const { _id } = req.user; // Get user ID from the request

  validateMongoDbId(_id); // Validate the user ID

  try {
      // Find the cart for the user
      let userCart = await Cart.findOne({ orderBy: _id });

      // If no cart exists, create a new one
      if (!userCart) {
          userCart = await Cart.create({
              orderBy: _id,
              products: [],
          });
      }

      // Check if the product already exists in the cart
      const productIndex = userCart.products.findIndex(p => p.product.toString() === productId);
      if (productIndex > -1) {
          // If it exists, update the quantity
          userCart.products[productIndex].quantity += quantity;
      } else {
          // If it does not exist, add the product to the cart
          userCart.products.push({ product: productId, quantity });
      }

      // Recalculate the cart total
      userCart.cartTotal = userCart.products.reduce((total, item) => {
          return total + item.price * item.quantity; // Make sure to fetch the price correctly
      }, 0);

      await userCart.save(); // Save the updated cart

      res.json(userCart); // Respond with the updated cart
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
});


const getUserCart=asyncHandler(async(req,res)=>{
  const {_id}=req.user;
  validateMongoDbId(_id);
try{
  const userCart=await Cart.findOne({orderBy:_id}).populate("products.product")
  res.json(userCart);
  console.log(userCart);
}
catch(error){
  throw new Error(error);
}
})

const emptyCart=asyncHandler(async(req,res)=>{
  const {_id}=req.user;
  validateMongoDbId(_id);
try{
  const user=await User.findOne({orderby:User._id})
  const cart=await Cart.findOneAndDelete({orderby:user._id})
  res.json(cart);
  console.log(cart);
}
catch(error){
  throw new Error(error);
}
})

const applyCoupon =asyncHandler(async(req,res)=>{
  const { coupon } = req.body;
  const {_id}=req.user;
  const validCoupon = await Coupon.findOne({name: coupon})
  if(validCoupon===null)
    {
      throw new Error("invalid coupon")
    }
    const user  = await User.findOne({_id})
    let{products,cartTotal}=await Cart.findOne({orderby:User._id}).populate("products.product")
    let totalAfterDiscount  = (cartTotal - (cartTotal*validCoupon.discount)/100).toFixed(2);
    await Cart.findOneAndUpdate({orderby:user._id},{totalAfterDiscount},{
      new:true
    })
    res.json(totalAfterDiscount);
    })
    const createOrder = asyncHandler(async (req, res) => {
      const { COD, couponapplied } = req.body;
      const { _id } = req.user;
      validateMongoDbId(_id); // Validate the user ID
  
      try {
          // Check if COD is provided
          if (!COD) throw new Error("Cash on delivery order failed");
  
          const user = await User.findById(_id);
          console.log('User:', user);
          const userCart = await Cart.findOne({ orderBy: user._id });
          console.log('User Cart:', userCart);
  
          // Check if userCart exists
          if (!userCart) {
              return res.status(404).json({ message: "User cart not found." });
          }
  
          let finalAmount = 0;
          // Calculate final amount based on whether a coupon is applied
          if (couponapplied && userCart.totalAfterDiscount) {
              finalAmount = userCart.totalAfterDiscount;
          } else {
              finalAmount = userCart.cartTotal;
          }
  
          // Create a new order
          const newOrder = await new Order({
              products: userCart.products,
              paymentIntent: {
                  id: uniqid(),
                  method: "COD",
                  amount: finalAmount,
                  status: "Cash on Delivery",
                  created: Date.now(),
                  currency: "USD",
              },
              orderBy:_id,
              orderStatus: "Cash on Delivery",
          }).save();
  
          // Send response with the new order
          res.json(newOrder);
  
          // Update product quantities based on the order
          const update = userCart.products.map((item) => {
              return {
                  updateOne: {
                      filter: { _id: item.product._id },
                      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
                  },
              };
          });
  
          const updated = await Product.bulkWrite(update,{});
          res.json({ message: "Success", updated });
      } catch (error) {
          res.status(500).json({ message: error.message }); // Send error message in response
      }
  });
  

    // const createOrder=asyncHandler(async(req,res)=>{
    //   const {COD,couponapplied}=req.body;
    //   const {_id}=req.user;
    //   validateMongoDbId(_id);
    //   try{
    //     if(!COD) throw new error("cash on delivery is failed")
    //       const user=await User.findById(_id)
    //     let userCart=await Cart.findOne({orderBy:user._id});
    //     let finalAmount=0;
    //     if(couponapplied&&userCart.totalAfterDiscount){
    //     }else{
    //       finalAmount=userCart.cartTotal;
    //     }
    //     let newOrder=await new Order({
    //       products:userCart.products,
    //       paymentIntent:{
    //         id:uniqid(),
    //         mathod:"COD",
    //         amount:finalAmount,
    //         status:"Cash on Delivery",
    //         created:Date.now(),
    //         currency:"USD"
    //       },
    //       orderBy:user._id,
    //       orderStatus:"Cash on Delivery"
    //     }).save();
    //     res.json(newOrder);

    //     let update = userCart.products.map((item)=>{
    //       return {
    //         updateOne:
    //         {
    //           filter:{_id:item.product._id},
    //           update:{$inc:{quantity: -item.quantity,sold: +item.count}}
    //         }

    //       }
            
          
    //     })
    //     const updated=await Product.bulkWrite(update,{})
    //     res.json({message:success,updated:updated})
  

    //   }
    //   catch(error){
    //     throw new Error(error)
    //   }
      
    // })
 
const getallOrder=asyncHandler(async(req,res)=>{
  const { _id } = req.user;
  validateMongoDbId(_id);
  try{
    const allOrders=await Order.find({orderBy:_id}).populate('products.product')
    res.json(allOrders)
  }
  catch(error){
    throw new Error(error)
  }
})

const updateOrderStatus = asyncHandler(async(req,res)=>{
  const status=req.body;
  const {_id}=req.params;
  

  try{
    const updateOrderStatus=await Order.findByIdAndUpdate(_id,{
      orderStatus:status,
      paymentIntent:{
        status:status
      }
    },{
      new:true
    }
  );
    res.json(updateOrderStatus);
  }
  catch(error){
    throw new Error(error)
  }
})

module.exports = { 
    createUser,
    loginUserCtrl,
    loginAdmin,
    handleRefreshToken,
    logoutUser,
    updatedUser,
    saveAddress,
    getallUser,
    getaUser,
    deleteUser,
    updatedUser,
blockUser,
unblockUser ,
handleRefreshToken,
logoutUser,
updatePassword,
forgotPasswordToken,
resetPassword,
getWishList,
userCart,
getUserCart,
emptyCart,
applyCoupon,
createOrder,
getallOrder,
addToCart,
updateOrderStatus}; // Make sure it's an object with createUser
  

