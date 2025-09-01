const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(restrictTo('admin'), getAllUsers);

router.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(restrictTo('admin'), deleteUser);

module.exports = router;   