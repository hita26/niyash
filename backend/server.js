const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const initDefaults = require('./config/initDefaults');

// Load environment variables
dotenv.config();

// Connect to Database and initialize defaults asynchronously
connectDB()
  .then(() => initDefaults())
  .catch((err) => console.error('Database initialization error:', err.message));

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads Static Folder (use /tmp/uploads on Vercel)
const uploadDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  // Ignore in read-only environments
}
app.use('/uploads', express.static(uploadDir));

// Database readiness middleware for all /api routes
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      await connectDB();
      await initDefaults();
    } catch (err) {
      return res.status(503).json({ message: 'Database unavailable', error: err.message });
    }
  }
  next();
});

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/ledger', require('./routes/ledgerRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/users', require('./routes/userRoutes'));


// Serve static frontend build if available
const frontendDist = path.join(__dirname, '../frontend/dist');

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Default API landing in dev mode without frontend build
  app.get('/', (req, res) => {
    res.send('Niyansh Pharma API is running...');
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });
}

module.exports = app;
