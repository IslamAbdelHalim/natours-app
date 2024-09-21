const fs = require('fs');
const path = require('path');
const crypto = require('crypto')

const filePath = path.resolve(__dirname, '../dev-data/data/users.json')

const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));


// Create Handlers

/**
 * @desc Request to all all users
 * @route /
 * @method GET
 * @access private
*/
async function getAllUsers (req, res) {
  res.status(200).json({
    'status': 'success',
    'usersLength': users.length,
    users
  })
}

/**
 * @desc Request to create a new user
 * @route /
 * @method POST
 * @access public
*/
async function createUser(req, res) {
  const id = crypto.randomUUID();
  const newUser = Object.assign({_id: id}, req.body);
  users.push(newUser);
  fs.writeFile(filePath, JSON.stringify(users), 'utf-8', err => {
    if (err) console.log(err);

    res.status(201).json({
      'status': 'success',
      'usersLength': users.length,
      newUser
    })
  })
}

/**
 * @desc Request to get a user by id
 * @route /:id
 * @method GET
 * @access private
*/
async function getUser (req, res) {
  const id = req.params.id;
  const user = await users.find(user => user._id === id);
  if (!user) {
    res.status(404).json({
      message: 'not found'
    })
    return;
  }
  
  res.status(200).json({
    "status": "success",
    user
  });
}

/**
 * @desc Request to update a user by id
 * @route /:id
 * @method PATCH
 * @access private
*/
async function updateUser (req, res) {
  const id = req.params.id;
  const userIdx = await users.findIndex(user => user._id === id);
  if (userIdx === -1) {
    res.status(404).json({
      message: 'not found'
    })
  }

  for (const [key, value] of Object.entries(req.body)) {
    users[userIdx][key] = value;
  }

  res.status(200).json({
    message: 'users updated',
    user: users[userIdx]
  })

}

/**
 * @desc Request to delete a user by id
 * @route /:id
 * @method DELETE
 * @access private
*/
async function deleteUser (req, res) {
  const id = req.params.id;
  const userIdx = users.findIndex(user => user._id === id);
  if (userIdx === -1) {
    res.status(404).json({
      message: 'not found'
    })
  }

  users.splice(userIdx, 1);

  res.status(200).json({
    message: 'users deleted',
    users
  });
}

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
}