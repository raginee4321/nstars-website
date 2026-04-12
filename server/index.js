import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, 'uploads/gallery/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
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

// In-memory storage for demo (in production, use a real database)
let galleryImages = [
  {
    id: 1,
    description: 'Training Session',
    image_path: 'https://images.pexels.com/photos/7045743/pexels-photo-7045743.jpeg'
  },
  {
    id: 2,
    description: 'Championship Event',
    image_path: 'https://images.pexels.com/photos/8611180/pexels-photo-8611180.jpeg'
  },
  {
    id: 3,
    description: 'Belt Testing Ceremony',
    image_path: 'https://images.pexels.com/photos/7045558/pexels-photo-7045558.jpeg'
  }
];

let nextImageId = 4;

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
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

app.get('/api/gallery', (req, res) => {
  res.json({ success: true, data: galleryImages });
});

// Admin routes
app.post('/api/admin/gallery/upload', upload.single('gallery_image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { description } = req.body;
    const imagePath = `/uploads/gallery/${req.file.filename}`;
    
    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    const newImage = {
      id: nextImageId++,
      description: description || 'No description',
      image_path: `${baseUrl}${imagePath}`
    };

    galleryImages.unshift(newImage); // Add to beginning of array
    
    res.json({ 
      success: true, 
      message: 'Image uploaded successfully',
      image: newImage
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

app.delete('/api/admin/gallery/:id', (req, res) => {
  const imageId = parseInt(req.params.id);
  const imageIndex = galleryImages.findIndex(img => img.id === imageId);
  
  if (imageIndex === -1) {
    return res.status(404).json({ success: false, message: 'Image not found' });
  }
  
  galleryImages.splice(imageIndex, 1);
  res.json({ success: true, message: 'Image deleted successfully' });
});

app.post('/api/register', (req, res) => {
  const { name, email, phone } = req.body;
  // In a real application, you would save to database
  console.log('Registration:', { name, email, phone });
  res.json({ success: true, message: 'Registration successful' });
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

// Create uploads directory if it doesn't exist
import { mkdirSync, existsSync } from 'fs';
const uploadsDir = join(__dirname, 'uploads/gallery');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});