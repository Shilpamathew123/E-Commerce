const express=require('express')
const router=express.Router();
const {createCoupon}  = require('../controller/couponContl')
const {authMiddleWare,isAdmin}=require('../middlewares/authMiddleware')


router.post('/',createCoupon)



module.exports=router;