import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

console.log('Testing connection to:', uri.split('@')[1]); // Log host part for safety

async function test() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('SUCCESS: Connected to MongoDB successfully!');
    process.exit(0);
  } catch (err) {
    console.error('FAILURE: Could not connect to MongoDB.');
    console.error('Error details:', err.message);
    process.exit(1);
  }
}

test();
