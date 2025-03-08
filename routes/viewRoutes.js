const router = require('express').Router();

const viewController = require('../controllers/viewControllers');

router.get('/overview', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);

module.exports = router;
