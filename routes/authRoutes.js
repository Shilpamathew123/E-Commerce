// routes/authRoutes.js
const express = require('express');
const { createUser,loginUserCtrl,getallUser,getaUser,deleteUser,updateUser,blockUser,unblockUser, handleRefreshToken, logoutUser } = require('../controller/userCtrl'); 
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();

console.log(createUser);

router.post('/register', createUser); 
router.post('/login', loginUserCtrl);
router.get('/all-users',getallUser);
router.get("/refresh",handleRefreshToken);
router.get("/logout",logoutUser)
router.get("/:id",authMiddleware,isAdmin,getaUser);
router.delete("/:id",deleteUser);
router.put("/edit-user",authMiddleware,updateUser);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);


// router.post('/register',(req,res,next)=>{
//     console.log('register route hit');
//      createUser(req,res,next); }); // Ensure this matches your Postman request

module.exports = router;
