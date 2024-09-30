const Tour = require('../models/Tour');
const APIFeature = require('.././utils/apiFeature');

//middleware for cheapest 5 and hight rating
function topRatingAndCheapest(req, res, next) {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields =
    'name, price, ratingsAverage, startDates, ratingsQuantity, difficulty';
  next();
}

// All Handler method

/**
 * @desc Request to get all tours
 * @route /
 * @method GET
 * @access public
 */
async function getAllTours(req, res) {
  let tours = new APIFeature(Tour, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  tours = await tours.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
}

/**
 * @desc Request to create a new Tour
 * @route /
 * @method PUT
 * @access private (only admin)
 */
async function createNewTour(req, res) {
  try {
    //method one
    const tour = await Tour.create(req.body);

    // method two
    // const newTour = new Tour(req.body);

    //persist in  and use asynchronous function because you inside event loop
    // const tour = await newTour.save();
    res.status(201).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error.....' });
  }
}

/**
 * @desc Request to get Tour by id
 * @route /:id
 * @method GET
 * @access private
 */
async function getTourById(req, res) {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    res.status(404).json({ message: 'not found' });
    return;
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
}

/**
 * @desc Request to update Tour by id
 * @route /:id
 * @method PATCH
 * @access private (only admin)
 */
async function updateTourById(req, res) {
  try {
    const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: 'Update this tour',
      newTour,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error....' });
  }
}

/**
 * @desc Request to delete Tour by id
 * @route /:id
 * @method DELETE
 * @access private (only admin)
 */
async function deleteTourById(req, res) {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    message: 'Deleted',
  });
}

/**
 * @desc Request to  get All statistics (aggregate pipline)
 * @route /
 * @method GET
 * @access private (only admin)
 */
async function getStatistics(req, res) {
  try {
    const statistics = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 },
        },
      },
      {
        $group: {
          _id: '$difficulty',
          numTour: { $sum: 1 },
          sumRating: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    console.log(statistics);
    res.status(200).json({
      message: 'success',
      statistics,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server Error.....' });
  }
}

module.exports = {
  getAllTours,
  createNewTour,
  getTourById,
  updateTourById,
  deleteTourById,
  getStatistics,
  topRatingAndCheapest,
};
