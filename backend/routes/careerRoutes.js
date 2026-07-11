const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Career = require('../models/Career');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: PDF or Word Documents Only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Submit a job application
// @route   POST /api/careers
// @access  Public
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, position, experience, coverLetter } = req.body;

    if (!name || !email || !phone || !position || !experience) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const careerData = {
      name,
      email,
      phone,
      position,
      experience,
      coverLetter,
      resumePath: req.file ? `/uploads/${req.file.filename}` : '',
    };

    const career = new Career(careerData);
    const savedCareer = await career.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      career: savedCareer,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get all applications (admin dashboard view)
// @route   GET /api/careers
// @access  Public (simplified, can be authenticated in production)
router.get('/', async (req, res) => {
  try {
    const applications = await Career.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Delete a career application
// @route   DELETE /api/careers/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    if (career.resumePath) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', career.resumePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Career.deleteOne({ _id: req.params.id });
    res.json({ message: 'Application removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
