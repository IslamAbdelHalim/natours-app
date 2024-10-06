const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const user = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Please Enter you username'],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'please provide your password'],
      minLength: [8, 'Password must be at least 8 character'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      trim: true,
      required: [true, 'please confirm your password'],
      minLength: [8, 'Password must be at least 8 character'],
      // working only with create and save
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Password are not the same',
      },
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'You must enter valid Email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please Provide a valid Email'],
    },
    photo: String,
    passwordLastChange: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  },
);

// crypt password after save
user.pre('save', async function (next) {
  if (!this.isModified('password')) return next;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// create instance method to verify password
user.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// create an instance method for changing the password
user.methods.changePassword = function (jwtTimeStamp) {
  if (this.passwordLastChange) {
    const changeAt = parseInt(this.passwordLastChange / 1000, 10);
    return changeAt > jwtTimeStamp;
  }
  return false;
};

const User = mongoose.model('Users', user);

module.exports = User;
