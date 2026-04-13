import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nstars_taekwondo';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true
});

// We will use memory storage to avoid file system read-only issues on Vercel
// and bypass multer-storage-cloudinary signature bugs.

// Mongoose Models
const GallerySchema = new mongoose.Schema({
  description: { type: String, required: true },
  image_path: { type: String, required: true },
  cloudinary_id: { type: String },
  createdAt: { type: Date, default: Date.now },
});

GallerySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

const GalleryItem = mongoose.model('GalleryItem', GallerySchema);

const RegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

RegistrationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

const Registration = mongoose.model('Registration', RegistrationSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(join(__dirname, 'uploads')));

const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Routes
app.get('/api/health', async (req, res) => {
  try {
    const pingResult = await cloudinary.api.ping();
    res.json({ 
      status: 'Server is running', 
      timestamp: new Date().toISOString(),
      cloudinaryPing: 'Success',
      envDebug: {
        hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        secretLength: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.length : 0,
        secretEnd: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.slice(-3) : 'none'
      }
    });
  } catch (error) {
    res.json({ 
      status: 'Server is running', 
      timestamp: new Date().toISOString(),
      cloudinaryPing: 'Failed',
      cloudinaryError: error.message || error,
      envDebug: {
        hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        secretLength: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.length : 0,
        secretEnd: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.slice(-3) : 'none'
      }
    });
  }
});

// API Routes for future features
app.get('/api/events', (req, res) => {
  const events = [
    {
      id: 1,
      title: 'Annual Championship',
      date: '2024-03-15',
      description: 'District level Taekwondo championship'
    },
    {
      id: 2,
      title: 'Training Camp',
      date: '2024-02-20',
      description: 'Intensive training camp for advanced students'
    }
  ];
  res.json({ success: true, data: events });
});

app.get('/api/gallery', async (req, res) => {
  try {
    const images = await GalleryItem.find().sort({ createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch gallery' });
  }
});

// Admin routes
app.post('/api/admin/gallery/upload', upload.single('gallery_image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { description } = req.body;
    
    // Upload directly using Cloudinary Stream
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'nstars-gallery',
          allowed_formats: ['jpg', 'png', 'jpeg'],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const newImage = new GalleryItem({
      description: description || 'No description',
      image_path: uploadResult.secure_url, 
      cloudinary_id: uploadResult.public_id,
    });

    await newImage.save();
    
    res.json({ 
      success: true, 
      message: 'Image uploaded successfully',
      image: newImage
    });
  } catch (error) {
    console.error('Upload error:', error);
    const errorDetails = error.message || (typeof error === 'object' ? JSON.stringify(error) : 'Upload failed');
    res.status(500).json({ success: false, message: `Details: ${errorDetails} | ${String(error)}` });
  }
});

app.delete('/api/admin/gallery/:id', async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Delete from Cloudinary
    if (item.cloudinary_id) {
      await cloudinary.uploader.destroy(item.cloudinary_id);
    }

    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const registration = new Registration({ name, email, phone });
    await registration.save();
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check for admin credentials
  if (username === 'admin' && password === 'admin12345') {
    res.json({ 
      success: true, 
      message: 'Admin login successful',
      user: { username: 'admin', role: 'admin' }
    });
    return;
  }
  
  // Regular user login (placeholder)
  console.log('Login attempt:', { username });
  res.json({ 
    success: true, 
    message: 'Login successful',
    user: { username, role: 'user' }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Create uploads directory if it doesn't exist
import { mkdirSync, existsSync } from 'fs';
const uploadsDir = join(__dirname, 'uploads/gallery');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

// Export the app for Vercel
export default app;

// Only start the server if not running on Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}