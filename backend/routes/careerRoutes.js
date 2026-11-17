const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Career = require('../models/Career');

// Ensure uploads directory exists (use /tmp on Vercel serverless)
const uploadDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Warning: Could not create upload directory:', err.message);
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
  const allowedExtensions = /pdf|doc|docx|jpg|jpeg|png|webp/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream',
    'image/jpeg',
    'image/jpg',
    'image/pjpeg',
    'image/png',
    'image/webp',
  ];
  const mimetype = allowedMimeTypes.includes(file.mimetype) || /pdf|msword|wordprocessingml|image\/(jpeg|jpg|png|webp)|octet-stream/i.test(file.mimetype);

  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, Word (.doc, .docx), and Image (.jpg, .jpeg, .png, .webp) files are allowed!'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Middleware to handle multer errors gracefully
const handleUpload = (req, res, next) => {
  upload.single('resume')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size exceeds limit (Max 10MB)' });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }
    next();
  });
};

// @desc    Submit a job application
// @route   POST /api/careers
// @access  Public
router.post('/', handleUpload, async (req, res) => {
  try {
    const { name, email, phone, position, experience, coverLetter } = req.body;

    if (!name || !email || !phone || !position || !experience) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const cleanPhone = phone.toString().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return res.status(400).json({ message: 'Phone number must contain exactly 10 numeric digits' });
    }

    let resumePath = '';
    if (req.file) {
      if (process.env.VERCEL) {
        try {
          const buffer = fs.readFileSync(req.file.path);
          resumePath = `data:${req.file.mimetype};base64,${buffer.toString('base64')}`;
        } catch (err) {
          resumePath = `/uploads/${req.file.filename}`;
        }
      } else {
        resumePath = `/uploads/${req.file.filename}`;
      }
    }

    const careerData = {
      name,
      email: email.toLowerCase().trim(),
      phone: cleanPhone,
      position,
      experience,
      coverLetter,
      resumePath,
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
    
    if (career.resumePath && !career.resumePath.startsWith('data:')) {
      const filename = path.basename(career.resumePath);
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Could not remove file:', filePath, e.message);
        }
      }
    }
    
    await Career.deleteOne({ _id: req.params.id });
    res.json({ message: 'Application removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
