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




















module.exports={createCoupon
}