const Tour = require('../models/Tour');
const APIFeature = require('.././utils/apiFeature');
const AppError = require('../utils/appError');

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
}

/**
 * @desc Request to get Tour by id
 * @route /:id
 * @method GET
 * @access private
 */
async function getTourById(req, res, next) {
  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) return next(new AppError('No tour found with this ID', 404));

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
async function updateTourById(req, res, next) {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) return next(new AppError('No tour found with this ID', 404));

  res.status(200).json({
    message: 'Update this tour',
    tour,
  });
}

/**
 * @desc Request to delete Tour by id
 * @route /:id
 * @method DELETE
 * @access private (only admin)
 */
async function deleteTourById(req, res, next) {
  console.log(`delete this ${req.params.id}`);
  const tour = await Tour.findByIdAndDelete(req.params.id);
  console.log(tour);

  if (!tour) return next(new AppError('No tour found with this ID', 404));

  res.status(204).json({
    message: 'Deleted',
  });
}

/**
 * @desc Request to  get All statistics (aggregate pipeline)
 * @route /
 * @method GET
 * @access private (only admin)
 */
async function getStatistics(req, res) {
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

  res.status(200).json({
    message: 'success',
    statistics,
  });
}

async function getToursInYear(req, res) {
  try {
    const year = req.params.year * 1;
    const tours = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
    ]);

    res.status(200).json({
      message: 'success',
      result: tours.length,
      tours,
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * @desc Get Tours with in specific distance from specific location
 * @route /tours-within/:distance/center/:latlang/unit/:unit
 * @method GET
 * @access protected
 */
async function getToursWithin(req, res, next) {
  const { distance, latlang, unit } = req.params;
  const [lat, long] = latlang.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !long) {
    return next (new AppError('please provide correct longitude and latitude'))
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[long, lat], radius]}}
  });

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      data: tours,
    }
  })
}

async function getDistance (req, res, next) {
  const { latlang, unit } = req.params;
  const [lat, lng] = latlang.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next (new AppError('please provide correct longitude and latitude'))
  }

  console.log(lat, lng)

  const distance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      },
    },
    {
      $project: {
        name: 1,
        distance: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distance
    }
  })
}

module.exports = {
  getAllTours,
  createNewTour,
  getTourById,
  updateTourById,
  deleteTourById,
  getStatistics,
  topRatingAndCheapest,
  getToursInYear,
  getToursWithin,
  getDistance
};
