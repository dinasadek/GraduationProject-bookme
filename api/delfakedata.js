import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Hotel from './models/Hotel.js';
import Room from './models/Room.js';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

const deleteFakeDataExceptSome = async () => {
  try {
    // Example criteria for hotels to keep
    const hotelIdsToKeep = ['6627fd2949d31ee96ff1857f', '66288973df8570c91c9675f3','6628897bdf8570c91c9675f5','662889a7df8570c91c9675f9','6629ae277f2e9896b31fcba4']; // Replace with actual IDs
    await Hotel.deleteMany({ _id: { $nin: hotelIdsToKeep } });
    console.log('Hotels except specified ones deleted');
    
    // Example criteria for rooms to keep
    const roomIdsToKeep = ['662856bbb8b26b5f6b49734f', '66294b9edf8570c91c9676aa','66294c05df8570c91c9676af','6629af687f2e9896b31fcbb9','6667cc2536de40d47b0222af','6667cd3f36de40d47b0222b5']; // Replace with actual IDs
    await Room.deleteMany({ _id: { $nin: roomIdsToKeep } });
    console.log('Rooms except specified ones deleted');
    
    // Example criteria for users to keep
    const userIdsToKeep = ['6675e95f171d5aa205ddc28f','662994c42ef2f92fd9b2ee4d', '6629ac607f2e9896b31fcb90','662ed8d7a3ea62a763f0961b','6638edb5d590161fb7e65221','665cd01d1d07cca224952263']; // Replace with actual IDs
    await User.deleteMany({ _id: { $nin: userIdsToKeep } });
    console.log('Users except specified ones deleted');
  } catch (error) {
    console.error('Error deleting data:', error);
  } finally {
    mongoose.disconnect();
  }
};

const clearDatabaseExceptSome = async () => {
  await connectDB();
  await deleteFakeDataExceptSome();
};

clearDatabaseExceptSome();