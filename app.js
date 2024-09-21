const morgan = require('morgan');
const express = require('express');
const toursRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/userRoutes');

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


//using middleware to handle request body
app.use(express.json())

// using static middleware to manipulate with static file
app.use(express.static(`${__dirname}/public`));


//Mounting Routes
app.use('/api/v1/tours',toursRouter);
app.use('/api/v1/users',userRouter);



module.exports = app;