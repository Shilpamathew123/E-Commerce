// app.js
const express = require('express');
const dbConnect = require('./config/dbConnect');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const app = express();
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const productRouter = require('./routes/productRoute');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path= require('path');



app.set('view engine', 'ejs')

dbConnect(); // Initialize database connection
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Use the authRoutes with /api/user prefix
app.use('/api/user', authRoutes);
app.use('/api/product',productRouter);
app.set('views', path.join(__dirname, 'views'));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
  // Render the 'index' view and pass a variable 'name' to it
  res.render('index', { name: 'User' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

