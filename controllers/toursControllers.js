const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../dev-data/data/tours-simple.json");

const tours = JSON.parse(fs.readFileSync(filePath, "utf-8"));

function checkID(req, res, next, val) {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  next();
}

// All Handler method

/**
 * @desc Request to get all tours
 * @route /
 * @method GET
 * @access public
 */
function getAllTours(req, res) {
  res.status(200).json({
    status: "success",
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
function createNewTour(req, res) {
  // create an Id
  const id = tours.length + 1;
  // create an object tour
  const newTour = Object.assign({ id: id }, req.body);
  tours.push(newTour);

  //persist in Json file and use asynchronous function because you inside event loop
  fs.writeFile(filePath, JSON.stringify(tours), "utf-8", (error) => {
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  });
}

/**
 * @desc Request to get Tour by id
 * @route /:id
 * @method GET
 * @access private
 */
function getTourById(req, res) {
  const id = parseInt(req.params.id);
  const tour = tours.find((t) => t.id === id);
  // console.log(tour)
  if (!tour) {
    return res.status(404).json({ success: "fail" });
  }
  res.status(200).json({
    status: "success",
    results: tours.length,
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
function updateTourById(req, res) {
  const tour = tours.find((ele) => ele.id === parseInt(req.params.id));
  const updates = req.body;
  for (let [key, value] of Object.entries(updates)) {
    tour[key] = value;
  }

  res.status(200).json({
    message: "Update this tour",
    tour,
  });
}

/**
 * @desc Request to delete Tour by id
 * @route /:id
 * @method DELETE
 * @access private (only admin)
 */
function deleteTourById(req, res) {
  res.status(200).json({
    message: "Deleted",
  });
}

module.exports = {
  checkID,
  getAllTours,
  createNewTour,
  getTourById,
  updateTourById,
  deleteTourById,
};
