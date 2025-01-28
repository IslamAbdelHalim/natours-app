const User = require('../models/User');

/**
 * @desc Request to all all users
 * @route /
 * @method GET
 * @access private (admin)
 */
async function getAllUsers(req, res) {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    usersLength: users.length,
    users,
  });
}

/**
 * @desc Request to get a user by id
 * @route /:id
 * @method GET
 * @access private
 */
async function getUser(req, res) {
  const id = req.params.id;
  const user = await users.find((user) => user._id === id);
  if (!user) {
    res.status(404).json({
      message: 'not found',
    });
    return;
  }

  res.status(200).json({
    status: 'success',
    user,
  });
}

/**
 * @desc Request to update a user by id
 * @route /:id
 * @method PATCH
 * @access private
 */
async function updateUser(req, res) {
  console.log('run');
  const body = {};
  const allowedFiled = ['username', 'email', 'picture'];
  for (const key of Object.keys(req.body)) {
    if (allowedFiled.includes(key)) {
      body[key] = req.body[key];
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user,
  });
}

/**
 * @desc Request to delete a user by id
 * @route /:id
 * @method DELETE
 * @access private
 */
async function deleteUser(req, res) {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    message: 'success',
  });
}

/**
 * @desc Return user Data
 * @route /
 * @method get
 * @access private
 */
async function getMe (req, res) {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
}

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe
};
