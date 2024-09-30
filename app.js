// app.js
const express = require('express');
const dbConnect = require('./config/dbConnect');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const app = express();
const port=4000;

const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const productRouter = require('./routes/productRoute');
const blogRouter= require('./routes/blogRoute');
const categoryRouter= require('./routes/productcategoryRoute');
const blogcategoryRouter= require('./routes/blogcatRoutes');
const brandRouter= require('./routes/brandRoute');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path= require('path');



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

dbConnect(); // Initialize database connection
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Use the authRoutes with /api/user prefix
app.use('/api/user', authRoutes);
app.use('/api/product',productRouter);
app.use('/api/blog',blogRouter);
app.use('/api/category',categoryRouter);
app.use('/api/blogcategory',blogcategoryRouter);
app.use('/api/brand',brandRouter);




// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce Application!');
});

//const PORT = process.env.PORT || 4000;
app.listen(4000, () => {
  console.log(`Server is running on port ${port}`);
});

