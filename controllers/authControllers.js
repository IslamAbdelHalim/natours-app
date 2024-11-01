const { promisify } = require('util');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');

const createTokenAndSendIt = function (user, statusCode, res) {
  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: '1d',
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'message',
    token,
    data: {
      user,
    },
  });
};

// Sign up Request Handler
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const { password, ...userNoPass } = user._doc;
  createTokenAndSendIt(userNoPass, 201, res);
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

  createTokenAndSendIt(user, 200, res);
});

//auth middleware for protecting route
exports.protectRoute = asyncHandler(async (req, res, next) => {
  console.log('run');
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

  req.user = user;

  next();
});

exports.restrict = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('You not have this permission', 403));

    console.log('user is allow');
    next();
  };
};

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('this email is not exist', 404));

  const resetToken = user.createResetToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  const restURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forget your password? submit a new password and password confirm to: ${restURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token valid for 10 min',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'token sent to user',
    });
  } catch (error) {
    console.log(error);
    user.resetTokenPassword = undefined;
    user.resetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There is an error in sending an email', 500));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // get user from token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetTokenPassword: hashedToken,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(new AppError('User is not exist or Invalid Token', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetTokenPassword = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  createTokenAndSendIt(user, 200, res);
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  // get user
  const user = await User.findById(req.user.id).select('+password');

  // if (user.password !== req.body.password) {
  //   return next(new AppError('your current password is not correct', 401));
  // }

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('your current password is not correct', 401));
  }

  console.log(req.body.currentPassword);
  console.log(req.body.password);
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createTokenAndSendIt(user, 200, res);
});
