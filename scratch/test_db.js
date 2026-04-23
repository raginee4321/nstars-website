
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Connecting to:', MONGODB_URI);

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('SUCCESS: Connected to MongoDB');
    
    // Check if GalleryItem collection has items
    const GalleryItem = mongoose.model('GalleryItem', new mongoose.Schema({}));
    const count = await GalleryItem.countDocuments();
    console.log('GalleryItem count:', count);
    
    process.exit(0);
  } catch (err) {
    console.error('FAILURE: Could not connect to MongoDB:', err);
    process.exit(1);
  }
}

testConnection();
