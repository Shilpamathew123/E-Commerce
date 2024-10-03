const Coupon = require('../models/couponModel')
const validateMongoDbId=require('../utils/validateMongodbid');
const asynHandler=require('express-async-handler');


const createCoupon=asynHandler(async(req,res)=>{
    try{
        const newCoupon=await Coupon.create(req.body)
        res.json({
            "message":"Coupon created successfully",
            data:newCoupon
        })
      

    }
    catch{
        throw new Error('An error occurred while creating coupon')
    }
})

const getallCoupons=asynHandler(async(req,res)=>{
    try{
        const coupons=await Coupon.find()
        res.json({
            "message":"Coupons created successfully",
            data:coupons
        })
      

    }
    catch{
        res.status(500).json({ message: error.message || 'An error occurred while retrieving coupons' });
    }
    
})

const updateCoupon=asynHandler(async(req,res)=>{
    const{id}=req.params;
    validateMongoDbId(id);
    {id}
    try{
        const coupon=await Coupon.findByIdAndUpdate(id,req.body,{new:true});
        res.json({coupon})
      

    }
    catch{
        res.status(500).json({ message: error.message || 'An error occurred while retrieving coupons' });
    }
    
})

const deleteCoupon=asynHandler(async(req,res)=>{
    const{id}=req.params;
    validateMongoDbId(id);
    {id}
    try{
        const coupon=await Coupon.findByIdAndDelete(id,req.body,{new:true});
        res.json({coupon})
      

    }
    catch{
        res.status(500).json({ message: error.message || 'An error occurred while retrieving coupons' });
    }
    
})




















module.exports={createCoupon,getallCoupons,updateCoupon,deleteCoupon}
