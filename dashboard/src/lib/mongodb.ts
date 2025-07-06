import { MongoClient, Db } from 'mongodb';

const MONGO_DB_URL = process.env.MONGO_DB_URL || '';
const DB_NAME = 'Walmart';

if (!MONGO_DB_URL) {
  throw new Error('Please define the MONGO_DB_URL environment variable inside .env.local');
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let cachedClient: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(MONGO_DB_URL).connect();
  }
  cachedClient = global._mongoClientPromise;
} else {
  cachedClient = new MongoClient(MONGO_DB_URL).connect();
}

async function dbConnect(): Promise<Db> {
  const client = await cachedClient;
  return client.db(DB_NAME);
}

export async function getCollection(collectionName: string) {
  const db = await dbConnect();
  return db.collection(collectionName);
}

export default dbConnect;