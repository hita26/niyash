const express = require('express');
const router = express.Router();
const NewsUpdate = require('../models/NewsUpdate');

// Helper to escape special regex characters
const escapeRegex = (str) => {
  if (!str) return '';
  return str.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// @desc    Get all news updates (supports ?ticker=true, category, company, search)
// @route   GET /api/news
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { ticker, category, company, search, limit } = req.query;

    const query = {};

    if (ticker === 'true') {
      query.isTickerActive = true;
      // Filter out expired news if expiryDate is set
      query.$or = [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (company && company !== 'All') {
      query.company = { $regex: escapeRegex(company.trim()), $options: 'i' };
    }

    if (search && search.trim()) {
      const escaped = escapeRegex(search.trim());
      const searchCondition = [
        { title: { $regex: escaped, $options: 'i' } },
        { content: { $regex: escaped, $options: 'i' } },
        { company: { $regex: escaped, $options: 'i' } },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchCondition }];
        delete query.$or;
      } else {
        query.$or = searchCondition;
      }
    }


    let newsQuery = NewsUpdate.find(query).sort({ priority: 1, createdAt: -1 });

    if (limit) {
      newsQuery = newsQuery.limit(parseInt(limit, 10));
    }

    const news = await newsQuery;

    res.json({
      success: true,
      count: news.length,
      news,
    });
  } catch (error) {
    console.error('Get news updates error:', error);
    res.status(500).json({ message: 'Server error fetching news updates', error: error.message });
  }
});

// @desc    Get single news update by ID
// @route   GET /api/news/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const newsItem = await NewsUpdate.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ message: 'News update not found' });
    }
    res.json({ success: true, news: newsItem });
  } catch (error) {
    console.error('Get news update error:', error);
    res.status(500).json({ message: 'Server error fetching news update', error: error.message });
  }
});

// @desc    Create a new news / scheme announcement
// @route   POST /api/news
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      title,
      content,
      category = 'Scheme',
      company = 'DAXIA',
      isTickerActive = true,
      priority = 1,
      expiryDate,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newsItem = new NewsUpdate({
      title: title.trim(),
      content: content.trim(),
      category,
      company: company.trim(),
      isTickerActive: isTickerActive !== undefined ? Boolean(isTickerActive) : true,
      priority: parseInt(priority, 10) || 1,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    });

    const createdNews = await newsItem.save();

    res.status(201).json({
      success: true,
      message: 'News announcement created successfully',
      news: createdNews,
    });
  } catch (error) {
    console.error('Create news update error:', error);
    res.status(500).json({ message: 'Server error creating news update', error: error.message });
  }
});

// @desc    Update a news announcement / toggle ticker status
// @route   PUT /api/news/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const newsItem = await NewsUpdate.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ message: 'News update not found' });
    }

    if (req.body.title !== undefined) newsItem.title = req.body.title.trim();
    if (req.body.content !== undefined) newsItem.content = req.body.content.trim();
    if (req.body.category !== undefined) newsItem.category = req.body.category;
    if (req.body.company !== undefined) newsItem.company = req.body.company.trim();
    if (req.body.isTickerActive !== undefined)
      newsItem.isTickerActive = Boolean(req.body.isTickerActive);
    if (req.body.priority !== undefined)
      newsItem.priority = parseInt(req.body.priority, 10) || 1;
    if (req.body.expiryDate !== undefined)
      newsItem.expiryDate = req.body.expiryDate ? new Date(req.body.expiryDate) : undefined;

    const updatedNews = await newsItem.save();

    res.json({
      success: true,
      message: 'News update modified successfully',
      news: updatedNews,
    });
  } catch (error) {
    console.error('Update news update error:', error);
    res.status(500).json({ message: 'Server error updating news update', error: error.message });
  }
});

// @desc    Delete a news update
// @route   DELETE /api/news/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const newsItem = await NewsUpdate.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ message: 'News update not found' });
    }

    await NewsUpdate.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'News update deleted successfully',
    });
  } catch (error) {
    console.error('Delete news update error:', error);
    res.status(500).json({ message: 'Server error deleting news update', error: error.message });
  }
});

module.exports = router;
