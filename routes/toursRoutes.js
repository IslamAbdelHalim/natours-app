const express = require('express');
const {
  getAllTours,
  createNewTour,
  getTourById,
  updateTourById,
  deleteTourById,
  getStatistics,
  topRatingAndCheapest,
} = require('../controllers/toursControllers');
const asyncHandler = require('express-async-handler');

const router = express.Router();

//middleware for validation the create a new tour
function validateNewTour(req, res, next) {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      message: 'Bad Request',
    });
  }

  next();
}

// top 5 rating and cheap (Aliases)
router.route('/top-5-cheapest').get(topRatingAndCheapest, getAllTours);

router.route('/statistics').get(getStatistics);

//chaining method
router
  .route('/')
  .get(asyncHandler(getAllTours))
  .post(validateNewTour, createNewTour);

router
  .route('/:id')
  .get(asyncHandler(getTourById))
  .patch(asyncHandler(updateTourById))
  .delete(asyncHandler(deleteTourById));

module.exports = router;
