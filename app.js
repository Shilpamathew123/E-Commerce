// app.js
const express = require('express');
const dbConnect = require('./config/dbConnect');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const app = express();
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
console.log('JWT_SECRET:', process.env.JWT_SECRET);





dbConnect(); // Initialize database connection
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Use the authRoutes with /api/user prefix
app.use('/api/user', authRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

