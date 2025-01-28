const fs = require('fs');
require('dotenv').config({ path: '../config.env' });
const connectDB = require('./database/db');
const Tour = require('./models/Tour');
const Review = require('./models/reviewModel');
const User = require('./models/User');

connectDB();

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8'),
);
const users = JSON.parse(
  fs.readFileSync('./dev-data/data/users.json', 'utf-8'),
);
const reviews = JSON.parse(
  fs.readFileSync('./dev-data/data/reviews.json', 'utf-8'),
);


// dealing with tours Data
async function addAllTours() {
  try {
    await Tour.create(tours);
    console.log('all tours added');
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
}

async function deleteAllTours() {
  try {
    await Tour.deleteMany({});
    console.log('all tours Deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
}

// dealing with Users Data
async function addAllUsers() {
  try {
    await User.create(users, { validateBeforeSave: false});
    console.log('all Users added');
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
}

async function deleteAllUsers() {
  try {
    await User.deleteMany({});
    console.log('all Users Deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
}

// dealing with Reviews Data
async function addAllReviews () {
  try {
    await Review.create(reviews);
    console.log('all Reviews added');
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
}

async function deleteAllReviews() {
  try {
    await Review.deleteMany({});
    console.log('all Reviews Deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
}

if (process.argv[2] === 'add-tours') {
  addAllTours();
} else if (process.argv[2] === 'delete-tours') {
  deleteAllTours();
} else if (process.argv[2] === 'add-users') {
  addAllUsers();
} else if (process.argv[2] === 'delete-users') {
  deleteAllUsers();
} else if (process.argv[2] === 'add-reviews') {
  addAllReviews();
} else if (process.argv[2] === 'delete-reviews') {
  deleteAllReviews();
}