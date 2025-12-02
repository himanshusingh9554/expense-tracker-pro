const express = require('express');
const router = express.Router();
const { createContent, getContent } = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createContent) // Create a post
  .get(protect, getContent);    // View posts

module.exports = router;