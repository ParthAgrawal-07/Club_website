import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in environment variables');
}

// Cache connection across hot reloads in dev & across invocations in prod
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn; // ✅ Reuse existing connection
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,      // ← Don't buffer, fail fast
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}