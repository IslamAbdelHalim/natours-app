const { promisify } = require('util');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');

// Sign up Request Handler
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: '4d',
  });
  const { password, ...userNoPass } = user._doc;
  res.status(201).json({
    status: 'success',
    token,
    user: userNoPass,
  });
});

// login Request Handler
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // verify that that client enter email & password
  if (!email || !password)
    return next(new AppError('Please Enter Email and Password'), 400);

  // verify that user exist
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Please enter correct email or password'), 401);
  }

  // generate web token if use exist
  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: '4d',
  });

  res.status(200).json({
    status: 'success',
    token,
  });
});

//auth middleware for protecting route
exports.protectRoute = asyncHandler(async (req, res, next) => {
  // ensure that token is exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

  if (!token) return next(new AppError('You are not login'), 401);

  // verify the token
  const decode = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET);

  // ensure that the  user is exist
  const user = await User.findById(decode.id);
  if (!user) return next(new AppError('The user is not exist', 401));

  //check if the use change his password after token is sign
  // create an instance method in schema for that
  if (user.changePassword(decode.iat))
    return next(new AppError('Invalid token, Password has been changed'), 401);

  next();
});
