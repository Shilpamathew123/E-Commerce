// routes/authRoutes.js
const express = require('express');
const { createUser,loginUserCtrl,getallUser,getaUser,deleteUser,updateUser } = require('../controller/userCtrl'); 
const router = express.Router();

console.log(createUser);

router.post('/register', createUser); 
router.post('/login', loginUserCtrl);
router.get('/all-users',getallUser);
router.get("/:id",getaUser);
router.delete("/:id",deleteUser);
router.put("/:id",updateUser);

// router.post('/register',(req,res,next)=>{
//     console.log('register route hit');
//      createUser(req,res,next); }); // Ensure this matches your Postman request

module.exports = router;
