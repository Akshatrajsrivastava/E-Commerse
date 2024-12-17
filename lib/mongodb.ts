// src/lib/mongodb.ts
import mongoose from 'mongoose';

const connectMongo = async (): Promise<void> => {
    try {
        if (mongoose.connection.readyState >= 1) return;
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default connectMongo;