const Content = require('../models/Content');

// @desc    Create simple text post
// @route   POST /api/content
// @access  Private
const createContent = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Please add text' });
  }

  const content = await Content.create({
    user: req.user.id,
    text,
  });

  res.status(201).json(content);
};

// @desc    Get user content
// @route   GET /api/content
// @access  Private
const getContent = async (req, res) => {
  try {
    // Debug log to verify the request reached the controller
    console.log(`Fetching content for user: ${req.user.id}`);
    
    // Find content created by the current user, sorted by newest first
    const content = await Content.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(content);
  } catch (error) {
    console.error("Error in getContent:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createContent,
  getContent,
};