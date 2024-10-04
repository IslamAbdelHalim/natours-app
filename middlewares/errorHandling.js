const AppError = require('../utils/appError');

exports.notFoundHandling = (req, res, next) => {
  // const err = new Error(`Can not find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError('Can not find ${req.originalUrl} on this server!', 404));
};

exports.globalErrorHandling = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelop(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') {
      const message = `Invalid ${err.path}: ${err.value}`;
      err = new AppError(message, 400);
    }

    if (err.code === 11000) {
      const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
      const message = `Duplicate Value ${value}`;
      err = new AppError(message, 400);
    }

    if (err.name === 'ValidationError') {
      const message = err.message;
      err = new AppError(message, 400);
    }

    sendErrorProd(err, res);
  }
};

// message that will sent for developer
function sendErrorDevelop(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
}

// message that will show to the client
function sendErrorProd(err, res) {
  // if the error happen from the user
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // if the error from server
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server Error.....',
      err,
    });
  }
}
