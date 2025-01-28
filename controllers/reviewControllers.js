const Review = require('../models/Review');

// middleware for put tourId and UserId
const setTourUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;

  next();
}

/**
 * @desc Create a review
 * @method POST
 * @Route /
 * @access private
 * */
const createReview = async (req, res) => {
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review,
    }
  })
}

/**
 * @desc Get All Reviews
 * @method Get
 * @Route /
 * @access private
 * */
const getAllReviews = async (req, res) => {
  let filter = {};
  if (req.params.tourId) filter = {tour: req.params.tourId};

  const reviews = await Review.find(filter);

  console.log('done');

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    }
  })
}

module.exports = {
  setTourUserId,
  createReview,
  getAllReviews
}