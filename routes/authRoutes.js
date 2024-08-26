// routes/authRoutes.js
const express = require('express');
const { createUser,loginUserCtrl } = require('../controller/userCtrl'); 
const router = express.Router();

console.log(createUser);

router.post('/register', createUser); 
router.post('/login', loginUserCtrl);

// router.post('/register',(req,res,next)=>{
//     console.log('register route hit');
//      createUser(req,res,next); }); // Ensure this matches your Postman request

module.exports = router;
