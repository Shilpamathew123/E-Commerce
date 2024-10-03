const express = require("express");
const {
  createUser,
  loginUserCtrl,
  loginAdmin,
  getallUser,
  saveAddress,
  getaUser,
  deleteUser,
  updatedUser,
  blockUser,
  unblockUser,
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
  updateOrderStatus
  
  
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/order/update-order/:id",authMiddleware,isAdmin,updateOrderStatus);


router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/cart",authMiddleware, userCart);
router.post("/Add-cart",authMiddleware, addToCart);
router.post('/cart/applycoupon',authMiddleware,applyCoupon);
router.post('/cart/cash-order',authMiddleware,createOrder);

router.get('/cart/all-order',authMiddleware,getallOrder);
router.get("/all-users", getallUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);
router.get("/wishlist", authMiddleware,getWishList);
router.get("/cart",authMiddleware,getUserCart);

router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete('/empty-cart',authMiddleware,emptyCart)
router.delete("/:id", deleteUser);


router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
