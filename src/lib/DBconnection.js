import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not defined in .env.local');

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1); // optional: stop app if DB fails
  }
};

export default connectDB;
