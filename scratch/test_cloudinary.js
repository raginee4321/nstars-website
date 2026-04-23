
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: (process.env.MY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME)?.trim(),
  api_key: (process.env.MY_API_KEY || process.env.CLOUDINARY_API_KEY)?.trim(),
  api_secret: (process.env.MY_API_SECRET || process.env.CLOUDINARY_API_SECRET)?.trim(),
  secure: true
});

console.log('Cloud Name:', cloudinary.config().cloud_name);
console.log('API Key:', cloudinary.config().api_key);
// Don't log the full secret, just the length and last 3 chars
console.log('API Secret length:', cloudinary.config().api_secret ? cloudinary.config().api_secret.length : 0);
console.log('API Secret ends with:', cloudinary.config().api_secret ? cloudinary.config().api_secret.slice(-3) : 'N/A');

async function testCloudinary() {
  try {
    const result = await cloudinary.api.ping();
    console.log('Ping Result:', result);
    
    // Try a simple signed request
    const account = await cloudinary.api.usage();
    console.log('Account usage fetched successfully');
    process.exit(0);
  } catch (err) {
    console.error('Cloudinary Error:', err.message);
    if (err.error) console.error('Details:', err.error);
    process.exit(1);
  }
}

testCloudinary();
