const morgan = require('morgan');
const express = require('express');
const expressRateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const toursRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

//exports customize middleware
const ErrorHandling = require('./middlewares/errorHandling');

const rateLimit = expressRateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To Many request in one hour"
});

const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yml'), 'utf-8');

const app = express();

app.use(helmet())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//using middleware to handle request body
app.use(express.json({limit: '10kb'}));

app.use(mongoSanitize());

app.use(xss());

app.use(hpp({
  whitelist: ['duration', 'maxGroupSize', 'price']
}))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// make a request limit
app.use('/api', rateLimit)


// using static middleware to manipulate with static file
app.use(express.static(`${__dirname}/public`));

//Mounting Routes
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter)

// handle not found error

// app.all('*', notFoundErrorHandling.notFoundHandling); way one
app.use(ErrorHandling.notFoundHandling);

// global error handling
app.use(ErrorHandling.globalErrorHandling);
module.exports = app;
