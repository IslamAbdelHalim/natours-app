const router = require('express').Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userControllers');

router.post('/signup', require('../controllers/authControllers').signup);
router.post('/login', require('../controllers/authControllers').login);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
