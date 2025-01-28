const router = require('express').Router();
const {
  protectRoute,
  updatePassword,
  forgetPassword,
  resetPassword,
  signup,
  login, restrict,
} = require('../controllers/authControllers');

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe
} = require('../controllers/userControllers');

router.post('/signup', signup);
router.post('/login', login);

router.post('/forget-password', forgetPassword);
router.patch('/reset-password/:token', resetPassword);

router.use(protectRoute)

router.patch('/updateMyPassword', updatePassword);
router.patch('/updateInfo', updateUser);

router.route('/me').get(getMe);

router.route('/:id').get(restrict('admin'), getUser).delete(deleteUser);

module.exports = router;
