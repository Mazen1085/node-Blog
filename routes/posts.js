const express = require('express');
const { getAllPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/uploads'); 

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllPosts)
  .post(upload.single('image'), createPost);

router.route('/:id')
  .get(getPost)
  .patch(updatePost)
  .delete(deletePost);

module.exports = router;   