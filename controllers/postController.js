const Post = require('../models/posts');
const { validate, postValidationSchema } = require('../utils/validationSchemas');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('authorId', 'name email');
    res.status(200).json({ 
      status: 'success', 
      results: posts.length, 
      data: { posts } 
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('authorId', 'name email');
    if (!post) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'Post not found' 
      });
    }
    res.status(200).json({ status: 'success', data: { post } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Create post with validation
exports.createPost = [
  validate(postValidationSchema),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const image = req.file ? req.file.filename : undefined;
      
      const post = await Post.create({
        title,
        content,
        authorId: req.user._id,
        image
      });
      
      await post.populate('authorId', 'name email');
      
      res.status(201).json({ 
        status: 'success', 
        message: 'Post created successfully',
        data: { post } 
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }
];

// Update post with validation
exports.updatePost = [
  validate(postValidationSchema),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({ 
          status: 'fail', 
          message: 'Post not found' 
        });
      }
      
      // Users can only update their own posts unless they're admin
      if (post.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ 
          status: 'fail', 
          message: 'You can only update your own posts' 
        });
      }
      
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate('authorId', 'name email');
      
      res.status(200).json({ 
        status: 'success', 
        message: 'Post updated successfully',
        data: { post: updatedPost } 
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }
];

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'Post not found' 
      });
    }
    
    // Users can only delete their own posts unless they're admin
    if (post.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        status: 'fail', 
        message: 'You can only delete your own posts' 
      });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    
    res.status(204).json({ 
      status: 'success', 
      message: 'Post deleted successfully',
      data: null 
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};