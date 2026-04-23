import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Initialize environment variables
dotenv.config(); // Standard load from .env in process.cwd()
// Fallback if started from a subdirectory
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: join(dirname(dirname(fileURLToPath(import.meta.url))), '.env') });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nstars_taekwondo';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Cloudinary Configuration - Bypassing Vercel auto-injected variables by using custom names
// Cloudinary Configuration
cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || process.env.MY_CLOUD_NAME)?.trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || process.env.MY_API_KEY)?.trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || process.env.MY_API_SECRET)?.trim(),
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

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
    delete ret.otp;
    delete ret.otpExpires;
  }
});

const User = mongoose.model('User', UserSchema);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow any origin for now to prevent CORS issues on Vercel
    // Even if FRONTEND_URL is not set in Vercel Dashboard
    callback(null, true);
  },
  credentials: true,
}));
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
    const crypto = await import('crypto');
    const secretHash = process.env.CLOUDINARY_API_SECRET ? crypto.createHash('md5').update(process.env.CLOUDINARY_API_SECRET).digest('hex') : 'none';
    const urlHash = process.env.CLOUDINARY_URL ? crypto.createHash('md5').update(process.env.CLOUDINARY_URL).digest('hex') : 'none';

    res.json({ 
      status: 'Server is running', 
      timestamp: new Date().toISOString(),
      cloudinaryPing: 'Skipped for diagnostic',
      envDebug: {
        hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        secretHash: secretHash,
        urlHash: urlHash,
        secretLength: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.length : 0,
        secretEnd: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.slice(-3) : 'none'
      }
    });
  } catch (error) {
    res.json({ error: error.message });
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

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"N Stars Academy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email - N Stars Academy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #ef4444; margin: 0;">N Stars Academy</h1>
          <p style="color: #64748b; font-size: 16px;">Elevate Your Journey</p>
        </div>
        <div style="padding: 24px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
          <h2 style="color: #1e293b; margin-top: 0;">Verify Your Email</h2>
          <p style="color: #475569; font-size: 16px;">Please use the following 6-digit code to verify your account:</p>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #ef4444; margin: 24px 0; padding: 12px; border: 2px dashed #cbd5e1; border-radius: 8px;">
            ${otp}
          </div>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
        <div style="margin-top: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
          <p>&copy; 2024 N Stars Academy. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    // We don't throw here to avoid blocking the signup flow if email fails during testing,
    // but in production you might want to handle this more strictly.
  }
};

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpires
    });

    await user.save();
    
    // Send real-time OTP email
    await sendOTPEmail(email, otp);
    
    console.log(`New user created: ${email}. OTP: ${otp}`);

    res.json({ success: true, message: 'Signup successful. Please verify OTP.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Signup failed', error: error.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Account verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Account already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(email, otp);

    res.json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Admin check (keep existing admin login for now)
    if (email === 'admin' || email === 'admin@nstars.com') {
      if (password === 'admin12345') {
        const token = jwt.sign({ id: 'admin', isAdmin: true }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
        return res.json({ 
          success: true, 
          token,
          user: { name: 'Admin', email: 'admin@nstars.com', isAdmin: true, role: 'admin' }
        });
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: 'Please verify your account first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });

    res.json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.isAdmin ? 'admin' : 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

app.post('/api/login', (req, res) => {
  // Redirecting to /api/auth/login logic if needed
  res.status(410).json({ success: false, message: 'Please use /api/auth/login' });
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