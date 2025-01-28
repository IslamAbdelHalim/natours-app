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
const restrict = require('../controllers/authControllers').restrict;

const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter)

// top 5 rating and cheap (Aliases)
router.route('/top-5-cheapest').get(topRatingAndCheapest, getAllTours);

router.route('/statistics').get(getStatistics);
router.route('/tours-in-year/:year').get(asyncHandler(getToursInYear));

//chaining method
router
  .route('/')
  .get(asyncHandler(getAllTours))
  .post(protectRoute, restrict('admin', 'guide-lead'), asyncHandler(createNewTour));

router
  .route('/:id')
  .get(asyncHandler(getTourById))
  .patch(protectRoute, restrict('admin', 'guide-lead'), asyncHandler(updateTourById))
  .delete(
    protectRoute,
    restrict('admin', 'lead-guide'),
    asyncHandler(deleteTourById),
  );

module.exports = router;
