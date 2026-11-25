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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
app.use('/api/uploads', express.static(uploadDir));

// Centralized API router (supports both /api/* and root /* if Passenger strips PassengerBaseURI "/api")
const apiRouter = express.Router();

// Database readiness & cache-busting middleware for all API routes
let isDefaultsInitialized = false;
apiRouter.use(async (req, res, next) => {
  // Ensure all API responses return fresh data and are never cached by browser or CDN
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  try {
    await connectDB();
    if (!isDefaultsInitialized) {
      await initDefaults();
      isDefaultsInitialized = true;
    }
  } catch (err) {
    return res.status(503).json({ message: 'Database unavailable', error: err.message });
  }
  next();
});

// API Health / Landing Check
apiRouter.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Niyansh Pharma API is running...' });
});

// API Routes
apiRouter.use('/products', require('./routes/productRoutes'));
apiRouter.use('/companies', require('./routes/companyRoutes'));
apiRouter.use('/orders', require('./routes/orderRoutes'));
apiRouter.use('/ledger', require('./routes/ledgerRoutes'));
apiRouter.use('/news', require('./routes/newsRoutes'));
apiRouter.use('/enquiries', require('./routes/enquiryRoutes'));
apiRouter.use('/careers', require('./routes/careerRoutes'));
apiRouter.use('/users', require('./routes/userRoutes'));
apiRouter.use('/ai', require('./routes/aiRoutes'));
apiRouter.use('/settings', require('./routes/settingRoutes'));
apiRouter.use('/sync', require('./routes/syncRoutes'));
apiRouter.use('/audit', require('./routes/auditRoutes'));
apiRouter.use('/analytics', require('./routes/analyticsRoutes'));

app.use('/api', apiRouter);
app.use('/', require('./routes/seoRoutes'));

// Serve static frontend build if available (dev / monolithic mode)
const frontendDist = path.join(__dirname, '../frontend/dist');
const isPassengerMounted = Boolean(process.env.IN_PASSENGER || process.env.PASSENGER_BASE_URI);

if (fs.existsSync(frontendDist) && !isPassengerMounted) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // GoDaddy cPanel Passenger / API-only mode: also mount apiRouter at root in case PassengerBaseURI "/api" strips /api
  app.use('/', apiRouter);
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
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
