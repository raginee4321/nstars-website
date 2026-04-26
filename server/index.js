import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { mkdirSync, existsSync } from 'fs';
import crypto from 'crypto';

// ─── Environment Variables ────────────────────────────────────────────────────
dotenv.config();
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: join(dirname(dirname(fileURLToPath(import.meta.url))), '.env') });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Helper: read + trim env var ─────────────────────────────────────────────
const env = (name, defaultValue = '') => {
  const val = process.env[name];
  if (typeof val === 'string' && val.trim()) return val.trim();
  return defaultValue;
};

// ─── Cloudinary helpers (pure HTTP, no SDK signing) ───────────────────────────
const getCloudinaryConfig = () => ({
  cloudName: env('CLOUDINARY_CLOUD_NAME', 'MY_CLOUD_NAME'),
  apiKey:    env('CLOUDINARY_API_KEY',    'MY_API_KEY'),
  apiSecret: env('CLOUDINARY_API_SECRET', 'MY_API_SECRET'),
});

// Generate SHA-1 signature for signed Cloudinary API calls
const generateCloudinarySignature = (params, apiSecret) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHash('sha1').update(sortedParams + apiSecret).digest('hex');
};

// Delete an asset from Cloudinary using direct HTTP POST (no SDK)
const cloudinaryDelete = async (publicId) => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials not configured');
  }

  const timestamp = Math.round(Date.now() / 1000);
  const params    = { public_id: publicId, timestamp };
  const signature = generateCloudinarySignature(params, apiSecret);

  const formData  = new FormData();
  formData.append('public_id', publicId);
  formData.append('timestamp', String(timestamp));
  formData.append('api_key',   apiKey);
  formData.append('signature', signature);

  const res  = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    { method: 'POST', body: formData }
  );
  const data = await res.json();

  if (data.result !== 'ok' && data.result !== 'not found') {
    throw new Error(`Cloudinary delete failed: ${JSON.stringify(data)}`);
  }

  return data;
};

// ─── MongoDB Connection Management (Singleton for Vercel) ────────────────────
let isConnected = false;

const ensureConnected = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  const uri = env('MONGODB_URI');
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing');
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    isConnected = false;
    console.error('MongoDB connection error:', err);
    throw new Error(`Database connection failed: ${err.message}`);
  }
};

// Initial connection attempt (don't crash the server if it fails initially)
ensureConnected().catch(err => console.error('Initial DB connection failed:', err.message));

// ─── Mongoose Models ──────────────────────────────────────────────────────────
const GallerySchema = new mongoose.Schema({
  description:   { type: String, required: true },
  image_path:    { type: String, required: true },
  cloudinary_id: { type: String },
  createdAt:     { type: Date, default: Date.now },
});
GallerySchema.index({ createdAt: -1 });
GallerySchema.set('toJSON', {
  virtuals: true, versionKey: false,
  transform: (_, ret) => { ret.id = ret._id; delete ret._id; },
});
const GalleryItem = mongoose.model('GalleryItem', GallerySchema);

const RegistrationSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
RegistrationSchema.set('toJSON', {
  virtuals: true, versionKey: false,
  transform: (_, ret) => { ret.id = ret._id; delete ret._id; },
});
const Registration = mongoose.model('Registration', RegistrationSchema);

const UserSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  phone:      { type: String, required: true },
  password:   { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp:        { type: String },
  otpExpires: { type: Date },
  isAdmin:    { type: Boolean, default: false },
  createdAt:  { type: Date, default: Date.now },
});
UserSchema.set('toJSON', {
  virtuals: true, versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id; delete ret.password;
    delete ret.otp; delete ret.otpExpires;
  },
});
const User = mongoose.model('User', UserSchema);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: (_origin, cb) => cb(null, true), credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(join(__dirname, 'uploads')));

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('Only image files are allowed!'), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ─── Nodemailer ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false },
});

const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"N Stars Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your email - N Stars Academy',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;
                    border:1px solid #e2e8f0;border-radius:12px;background:#ffffff;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#ef4444;margin:0;">N Stars Academy</h1>
            <p style="color:#64748b;font-size:16px;">Elevate Your Journey</p>
          </div>
          <div style="padding:24px;background:#f8fafc;border-radius:8px;text-align:center;">
            <h2 style="color:#1e293b;margin-top:0;">Verify Your Email</h2>
            <p style="color:#475569;font-size:16px;">Use this 6-digit code to verify your account:</p>
            <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#ef4444;
                        margin:24px 0;padding:12px;border:2px dashed #cbd5e1;border-radius:8px;">
              ${otp}
            </div>
            <p style="color:#64748b;font-size:14px;">This code will expire in 10 minutes.</p>
          </div>
          <div style="margin-top:24px;text-align:center;color:#94a3b8;font-size:12px;">
            <p>&copy; 2024 N Stars Academy. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────
const apiRouter = express.Router();

// System Diagnostics Check
apiRouter.get('/system-check', async (_req, res) => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  
  let mongoStatus = 'unknown';
  let mongoError = null;
  try {
    await ensureConnected();
    mongoStatus = 'Connected';
  } catch (err) {
    mongoStatus = 'Error';
    mongoError = err.message;
  }

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: {
      is_production: process.env.NODE_ENV === 'production',
      is_vercel:     !!process.env.VERCEL,
    },
    mongodb: {
      status:  mongoStatus,
      state:   mongoose.connection.readyState,
      error:   mongoError,
      uri_set: !!env('MONGODB_URI'),
    },
    cloudinary: {
      cloud_name: cloudName || 'NOT_SET',
      api_key:    apiKey ? `${apiKey.slice(0, 3)}...${apiKey.slice(-3)}` : 'NOT_SET',
      secret_set: !!apiSecret,
    },
    auth: {
      jwt_secret_set: !!env('JWT_SECRET'),
      email_user_set: !!env('EMAIL_USER'),
      email_pass_set: !!env('EMAIL_PASS'),
    }
  });
});

// Legacy health check
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'Server is running', mongo: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

// Events
apiRouter.get('/events', (_req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: 'Annual Championship', date: '2024-03-15', description: 'District level Taekwondo championship' },
      { id: 2, title: 'Training Camp',        date: '2024-02-20', description: 'Intensive training camp for advanced students' },
    ],
  });
});

// Gallery – fetch all
apiRouter.get('/gallery', async (req, res) => {
  const start = Date.now();
  try {
    const limit  = parseInt(req.query.limit) || 100;
    const images = await GalleryItem.find().sort({ createdAt: -1 }).limit(limit);
    const duration = Date.now() - start;
    if (duration > 500) console.warn(`Slow gallery fetch: ${duration}ms`);
    res.json({ success: true, data: images, _debug: { duration: `${duration}ms` } });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gallery' });
  }
});

// Gallery – UPLOAD (legacy/buffer flow)
apiRouter.post('/admin/gallery/upload', upload.single('gallery_image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const { cloudName } = getCloudinaryConfig();
    if (!cloudName) return res.status(500).json({ success: false, message: 'CLOUDINARY_CLOUD_NAME is not configured' });

    const base64  = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const formData = new FormData();
    formData.append('file',          dataUri);
    formData.append('upload_preset', 'nstars_gallery');
    formData.append('folder',        'nstars-gallery');

    const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
    const responseText = await cloudinaryRes.text();
    let uploadResult;
    try {
      uploadResult = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Cloudinary response parse failed:', responseText);
      return res.status(500).json({ success: false, message: 'Cloudinary returned invalid response' });
    }

    if (uploadResult.error) return res.status(500).json({ success: false, message: uploadResult.error.message });

    const newImage = new GalleryItem({
      description:   req.body.description || 'No description',
      image_path:    uploadResult.secure_url,
      cloudinary_id: uploadResult.public_id,
    });

    await newImage.save();
    res.json({ success: true, message: 'Image uploaded successfully', image: newImage });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Gallery – SAVE (New preferred flow)
apiRouter.post('/admin/gallery/save', async (req, res) => {
  console.log('Received gallery save request:', req.body);
  
  if (mongoose.connection.readyState !== 1) {
    console.error('Save failed: MongoDB not connected (State: ' + mongoose.connection.readyState + ')');
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection is not ready. Please check MongoDB configuration.' 
    });
  }

  try {
    const { description, image_path, cloudinary_id } = req.body;
    if (!image_path) return res.status(400).json({ success: false, message: 'image_path is required' });

    const newImage = new GalleryItem({
      description:   description || 'No description',
      image_path,
      cloudinary_id,
    });

    await newImage.save();
    console.log('Image saved successfully to MongoDB:', newImage.id);
    res.json({ success: true, message: 'Image saved successfully', image: newImage });
  } catch (error) {
    console.error('Save error in MongoDB:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Gallery – DELETE
apiRouter.delete('/admin/gallery/:id', async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Image not found' });
    if (item.cloudinary_id) await cloudinaryDelete(item.cloudinary_id);
    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: `Delete failed: ${error.message}` });
  }
});

// Registration
apiRouter.post('/register', async (req, res) => {
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
apiRouter.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp            = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires     = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({ name, email, phone, password: hashedPassword, otp, otpExpires });
    await user.save();
    await sendOTPEmail(email, otp);
    res.json({ success: true, message: 'Signup successful. Please verify OTP.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Signup failed', error: error.message });
  }
});

// Auth – Verify OTP
apiRouter.post('/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    user.isVerified = true;
    user.otp        = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Account verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// Auth – Resend OTP
apiRouter.post('/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)           return res.status(404).json({ success: false, message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Account already verified' });
    user.otp        = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendOTPEmail(email, user.otp);
    res.json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
});

// Auth – Login
apiRouter.post('/auth/login', async (req, res) => {
  try {
    // Ensure DB is connected for non-hardcoded lookups
    await ensureConnected().catch(err => console.warn('Warning: DB connection check failed:', err.message));

    const { email: rawEmail, password: rawPassword } = req.body;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
    const password = typeof rawPassword === 'string' ? rawPassword.trim() : '';

    const JWT_SECRET = env('JWT_SECRET', 'your_jwt_secret');
    
    // 1. Hardcoded Admin Check (Bypasses DB)
    if (email === 'admin' || email === 'admin@nstars.com') {
      if (password === 'admin12345') {
        const token = jwt.sign({ id: 'admin', isAdmin: true }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ 
          success: true, 
          token, 
          user: { name: 'Admin', email: 'admin@nstars.com', isAdmin: true, role: 'admin' } 
        });
      }
    }

    // 2. Database User Check
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database is currently unavailable. Please try again later.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid email or password' });
    if (!user.isVerified) return res.status(400).json({ success: false, message: 'Please verify your account first' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid email or password' });
    
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      success: true, 
      token, 
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, role: user.isAdmin ? 'admin' : 'user' } 
    });
  } catch (error) {
    console.error('CRITICAL LOGIN ERROR:', error);
    res.status(500).json({ 
      success: false, 
      message: 'A server error occurred during login. Please contact support.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Legacy login
apiRouter.post('/login', (_req, res) => {
  res.status(410).json({ success: false, message: 'Please use /api/auth/login' });
});

// Mount the router at both /api and / to handle different Vercel routing scenarios
app.use('/api', apiRouter);
app.use('/', apiRouter);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ─── Local uploads directory (skipped on Vercel) ─────────────────────────────
if (!process.env.VERCEL) {
  try {
    const uploadsDir = join(__dirname, 'uploads/gallery');
    if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
  } catch (err) {
    console.warn('Could not create uploads directory:', err.message);
  }
}

// ─── Start ────────────────────────────────────────────────────────────────────
export default app;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}