import mongoose from 'mongoose';

const MONGO_DB_URL = process.env.MONGO_DB_URL || '';
if (!MONGO_DB_URL) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

declare global {
    var mongoose: {
        conn: mongoose.Mongoose | null;
        promise: Promise<mongoose.Mongoose> | null;
    };
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            dbName: 'Walmart'
        };

        cached.promise = mongoose.connect(MONGO_DB_URL, opts).then((mongoose) => {
            console.log('Database connected successfully');
            return mongoose;
        }).catch((error) => {
            console.error('Database connection error:', error);
            throw error;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export const getCollection = (collectionName: string) => {
    return mongoose.connection.collection(collectionName);
};

export default dbConnect;