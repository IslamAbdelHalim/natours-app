const express = require('express');
const { getAllTours, createNewTour, getTourById, updateTourById, deleteTourById, checkID } = require('../controllers/toursControllers')

const router = express.Router();

// params middleware
router.param('id', checkID);

//middleware for validation the create a new tour
function validateNewTour(req, res, next) {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      message: 'Bad Request'
    });
  }

  next();
}

//chaining method
router
  .route('/')
  .get(getAllTours)
  .post(validateNewTour, createNewTour);

router
  .route('/:id')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);


module.exports = router;