const express = require('express');
const { createCoupon, getallCoupons, updateCoupon,deleteCoupon } = require('../controller/couponContl');
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',createCoupon);
router.get('/',getallCoupons);
router.put('/:id',updateCoupon)
router.delete('/:id',deleteCoupon) // Example for getting a coupon

module.exports = router;
