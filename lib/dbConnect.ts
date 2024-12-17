// src/lib/dbConnect.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface DatabaseConnection {
    isConnected: number;
}

const connection: DatabaseConnection = {
    isConnected: 0,
};

async function dbConnect(): Promise<typeof mongoose> {
    if (connection.isConnected) {
        console.log("Using existing connection");
        return mongoose;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI as string);
        connection.isConnected = db.connections[0].readyState;
        console.log("New database connection");
        return mongoose;
    } catch (error) {
        throw new Error("Error connecting to database");
    }
}

async function dbDisconnect(): Promise<void> {
    if (!connection.isConnected) {
        return;
    }

    if (process.env.NODE_ENV === "production") {
        await mongoose.disconnect();
        connection.isConnected = 0;
    }
}

const db = { connect: dbConnect, disconnect: dbDisconnect };
export default db;
