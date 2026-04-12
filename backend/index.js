import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// In-memory gallery array (replace with DB if needed)
let gallery = [];
let idCounter = 1;

// Routes

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Get all gallery images
app.get('/api/gallery', (req, res) => {
  res.json(gallery);
});

// Upload image (Admin)
app.post('/api/admin/gallery/upload', upload.single('gallery_image'), (req, res) => {
  if (!req.file || !req.body.description) {
    return res.status(400).json({ success: false, message: 'Image and description are required.' });
  }

  const newImage = {
    id: idCounter++,
    image_path: `http://localhost:${PORT}/uploads/${req.file.filename}`,
    description: req.body.description,
  };

  gallery.push(newImage);

  res.json({ success: true, image: newImage });
});

// Delete image (Admin)
app.delete('/api/admin/gallery/:id', (req, res) => {
  const imageId = parseInt(req.params.id);
  const index = gallery.findIndex((img) => img.id === imageId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Image not found.' });
  }

  // Remove file from uploads folder
  const filePath = path.join(__dirname, gallery[index].image_path.replace(`http://localhost:${PORT}/`, ''));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  gallery.splice(index, 1);

  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
