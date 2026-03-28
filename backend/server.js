require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Only one declaration!
const path = require('path');
const connectDB = require('./config/db');

// Route Imports
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();

// 1. Setup Allowed Origins
const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://thefolio-project-six.vercel.app'];
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];

// 2. Single CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server or mobile (no origin)
    if (!origin) return callback(null, true);

    // Check if origin is in our list OR is a Vercel preview URL
    const isWhitelisted = allowedOrigins.includes(origin);
    const isVercelPreview = origin.endsWith('.vercel.app') && origin.includes('thefolio-project');

    if (isWhitelisted || isVercelPreview) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin); // Helps you debug in Render logs
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.send('Server is running and CORS is configured!');
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();