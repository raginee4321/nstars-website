import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { mkdirSync, existsSync } from 'fs';

// Initialize environment variables
dotenv.config();
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: join(dirname(dirname(fileURLToPath(import.meta.url))), '.env') });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MongoDB Connection ───────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nstars_taekwondo';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ─── Lazy Cloudinary Config ───────────────────────────────────────────────────
// IMPORTANT: We re-read env vars at request time to avoid Vercel caching stale values.
// We also trim() every value to eliminate hidden whitespace characters.
const getCloudinaryInstance = () => {
  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || process.env.MY_CLOUD_NAME || '').trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || process.env.MY_API_KEY || '').trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || process.env.MY_API_SECRET || '').trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(`Cloudinary env vars missing. cloud_name=${!!cloudName} api_key=${!!apiKey} api_secret=${!!apiSecret}`);
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
};

// ─── Mongoose Models ──────────────────────────────────────────────────────────
const GallerySchema = new mongoose.Schema({
  description: { type: String, required: true },
  image_path: { type: String, required: true },
  cloudinary_id: { type: String },
  createdAt: { type: Date, default: Date.now },
});

GallerySchema.index({ createdAt: -1 });

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

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: (_origin, callback) => callback(null, true),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(join(__dirname, 'uploads')));

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ─── Nodemailer ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"N Stars Academy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email - N Stars Academy',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:12px;background:#ffffff;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#ef4444;margin:0;">N Stars Academy</h1>
          <p style="color:#64748b;font-size:16px;">Elevate Your Journey</p>
        </div>
        <div style="padding:24px;background:#f8fafc;border-radius:8px;text-align:center;">
          <h2 style="color:#1e293b;margin-top:0;">Verify Your Email</h2>
          <p style="color:#475569;font-size:16px;">Please use the following 6-digit code to verify your account:</p>
          <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#ef4444;margin:24px 0;padding:12px;border:2px dashed #cbd5e1;border-radius:8px;">
            ${otp}
          </div>
          <p style="color:#64748b;font-size:14px;">This code will expire in 10 minutes.</p>
        </div>
        <div style="margin-top:24px;text-align:center;color:#94a3b8;font-size:12px;">
          <p>&copy; 2024 N Stars Academy. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check + Cloudinary diagnostics (NO secrets exposed)
app.get('/api/health', async (req, res) => {
  try {
    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || process.env.MY_CLOUD_NAME || '').trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY || process.env.MY_API_KEY || '').trim();
    const apiSecret = (process.env.CLOUDINARY_API_SECRET || process.env.MY_API_SECRET || '').trim();

    res.json({
      status: 'Server is running',
      timestamp: new Date().toISOString(),
      cloudinary: {
        cloud_name_set: !!cloudName,
        api_key_set: !!apiKey,
        api_secret_set: !!apiSecret,
        api_secret_length: apiSecret.length,   // helps detect truncation
        api_key_last4: apiKey.slice(-4),     // safe to expose last 4
      },
      mongo: mongoose.connection.readyState === 1 ? 'Connected' : `Disconnected (${mongoose.connection.readyState})`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Events
app.get('/api/events', (_req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: 'Annual Championship', date: '2024-03-15', description: 'District level Taekwondo championship' },
      { id: 2, title: 'Training Camp', date: '2024-02-20', description: 'Intensive training camp for advanced students' },
    ],
  });
});

// Gallery – fetch
app.get('/api/gallery', async (req, res) => {
  const start = Date.now();
  try {
    const limit = parseInt(req.query.limit) || 100;
    const images = await GalleryItem.find().sort({ createdAt: -1 }).limit(limit);
    const duration = Date.now() - start;
    if (duration > 500) console.warn(`Slow gallery fetch: ${duration}ms`);
    res.json({ success: true, data: images, _debug: { duration: `${duration}ms` } });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gallery' });
  }
});

// Gallery – upload
app.post('/api/admin/gallery/upload', upload.single('gallery_image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { description } = req.body;

    // Get a freshly configured Cloudinary instance on every request
    const cl = getCloudinaryInstance();

    const uploadResult = await new Promise((resolve, reject) => {
      // Do NOT pass cloud_name / api_key / api_secret here — they are ignored
      // by upload_stream and only cause confusion. The global config above handles them.
      const stream = cl.uploader.upload_stream(
        { folder: 'nstars-gallery' },
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

    res.json({ success: true, message: 'Image uploaded successfully', image: newImage });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: `Upload failed: ${error.message || String(error)}`,
    });
  }
});

// Gallery – delete
app.delete('/api/admin/gallery/:id', async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    if (item.cloudinary_id) {
      const cl = getCloudinaryInstance();
      await cl.uploader.destroy(item.cloudinary_id);
    }

    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: `Delete failed: ${error.message}` });
  }
});

// Registration
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

// Auth – Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({ name, email, phone, password: hashedPassword, otp, otpExpires });
    await user.save();

    await sendOTPEmail(email, otp);
    console.log(`New user: ${email}. OTP: ${otp}`);

    res.json({ success: true, message: 'Signup successful. Please verify OTP.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Signup failed', error: error.message });
  }
});

// Auth – Verify OTP
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

// Auth – Resend OTP
app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Account already verified' });

    user.otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTPEmail(email, user.otp);
    res.json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
});

// Auth – Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

    // Hardcoded admin shortcut
    if (email === 'admin' || email === 'admin@nstars.com') {
      if (password === 'admin12345') {
        const token = jwt.sign({ id: 'admin', isAdmin: true }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({
          success: true,
          token,
          user: { name: 'Admin', email: 'admin@nstars.com', isAdmin: true, role: 'admin' },
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

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.isAdmin ? 'admin' : 'user',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Legacy login route
app.post('/api/login', (_req, res) => {
  res.status(410).json({ success: false, message: 'Please use /api/auth/login' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ─── Uploads Directory (local only) ──────────────────────────────────────────
if (!process.env.VERCEL) {
  try {
    const uploadsDir = join(__dirname, 'uploads/gallery');
    if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
  } catch (err) {
    console.warn('Could not create uploads directory:', err.message);
  }
}

// ─── Start Server ─────────────────────────────────────────────────────────────
export default app;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}