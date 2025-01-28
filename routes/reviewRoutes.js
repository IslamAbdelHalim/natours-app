const express = require('express');
const router = express.Router({ mergeParams: true });

const { createReview, setTourUserId, getAllReviews } = require('../controllers/reviewControllers');

const { protectRoute, restrict } = require('../controllers/authControllers');

router.use(protectRoute);

router.route('/')
  .get(getAllReviews)
  .post(restrict('user'), setTourUserId, createReview);

module.exports = router;