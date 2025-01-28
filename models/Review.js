const mongoose = require('mongoose');

const Tour = require('./Tour')

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required:[ true, "Must enter a review"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'review must belong to a tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: [true, 'review must belong to a user']
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user'
  })
  next();
});

reviewSchema.statics.calcAverage = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: {tour: tourId}
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].nRating
  });
}

reviewSchema.post('save', function() {
  this.constructor.calcAverage(this.tour);
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;