import mongoose from 'mongoose';

const connectDB = async DB => {
  try {
    await mongoose.connect(DB);
    console.log('Database connected');
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
