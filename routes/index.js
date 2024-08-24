const express = require('express');
const dbConnect = require('../config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const path=require('path');

const authRouter = require(path.join(__dirname, 'routes', 'authRoutes'));
module.exports=dbConnect;
dbConnect();
console.log('Database Connected...');



const PORT=process.env.PORT || 4000;
app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

  app.use('/api/user',authRouter);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});