const router = require('express').Router();
const {
  protectRoute,
  updatePassword,
  forgetPassword,
  resetPassword,
  signup,
  login,
} = require('../controllers/authControllers');

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userControllers');

router.post('/signup', signup);
router.post('/login', login);

router.post('/forget-password', forgetPassword);
router.patch('/reset-password/:token', resetPassword);

router.patch('/updateMyPassword', protectRoute, updatePassword);
router.patch('/updateInfo', protectRoute, updateUser);

router.route('/').get(getAllUsers);

router.route('/:id').get(getUser).delete(protectRoute, deleteUser);

module.exports = router;
