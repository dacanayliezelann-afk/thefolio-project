//backend/server.js
require('dotenv').config(); // Load .env variables FIRST
const express =require('express');
const cors =require('cors');
const path =require('path');
const connectDB=require('./config/db');
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');
//Importroutes(youwillcreatethese files in the next steps)
const authRoutes =require('./routes/auth.routes');
const postRoutes =require('./routes/post.routes');
const commentRoutes=require('./routes/comment.routes');
const app=express();
connectDB(); //ConnecttoMongoDB
//──Middleware─────────────────────────────────────────────────
// CORS: local dev + comma-separated origins in ALLOWED_ORIGINS (e.g. your Vercel URL)
const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, origin);
      return callback(null, false);
    },
    credentials: true,
  })
);
//ParseincomingJSONrequestbodies
app.use(express.json());
//Serveuploadedimagefilesaspublic URLs
//e.g.http://localhost:5000/uploads/my-image.jpg
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
//──Routes────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
//──StartServer──────────────────────────────────────────────
const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
console.log(`Serverisrunningonhttp://localhost:${PORT}`);
});
