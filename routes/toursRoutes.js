const express = require('express');
const asyncHandler = require('express-async-handler');
const {
  getAllTours,
  createNewTour,
  getTourById,
  updateTourById,
  deleteTourById,
  getStatistics,
  topRatingAndCheapest,
  getToursInYear,
} = require('../controllers/toursControllers');
const protectRoute = require('../controllers/authControllers').protectRoute;

const router = express.Router();

// top 5 rating and cheap (Aliases)
router.route('/top-5-cheapest').get(topRatingAndCheapest, getAllTours);

router.route('/statistics').get(getStatistics);
router.route('/tours-in-year/:year').get(asyncHandler(getToursInYear));

//chaining method
router
  .route('/')
  .get(protectRoute, asyncHandler(getAllTours))
  .post(asyncHandler(createNewTour));

router
  .route('/:id')
  .get(asyncHandler(getTourById))
  .patch(asyncHandler(updateTourById))
  .delete(asyncHandler(deleteTourById));

module.exports = router;
