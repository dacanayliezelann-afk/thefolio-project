require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/db');

const adminRoutes   = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');
const authRoutes    = require('./routes/auth.routes');
const postRoutes    = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();

// ── Allowed Origins ───────────────────────────────────────────────────────────
const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://thefolio-project-six.vercel.app',
];
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const ok = allowedOrigins.includes(origin) ||
      (origin.endsWith('.vercel.app') && origin.includes('thefolio-project'));
    if (ok) callback(null, true);
    else {
      console.log('CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsers ──────────────────────────────────────────────────────────────
// ✅ 20 mb limit — base64 images are ~33 % larger than the raw file.
//    Must be declared ONCE and BEFORE routes. The old code had express.json()
//    called twice (default 100 kb first, then 20 mb), so large payloads were
//    always rejected before the generous limit could apply.
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static files (kept for any legacy uploads still on disk)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.send('Server is running!'));
app.use('/api/auth',     authRoutes);
app.use('/api/posts',    postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/contact',  contactRoutes);

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message || 'Server Error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};
startServer();