const morgan = require('morgan');
const express = require('express');
const toursRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/userRoutes');

//exports customize middleware
const ErrorHandling = require('./middlewares/errorHandling');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//using middleware to handle request body
app.use(express.json());

// using static middleware to manipulate with static file
app.use(express.static(`${__dirname}/public`));

//Mounting Routes
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);

// handle not found error

// app.all('*', notFoundErrorHandling.notFoundHandling); way one
app.use(ErrorHandling.notFoundHandling);

// global error handling
app.use(ErrorHandling.globalErrorHandling);
module.exports = app;
