import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env');
}

declare global {
  var mongoose: any;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
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
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;

export type Settings = Record<string, string>;

export interface Package {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  duration: string;
  price: number;
  badge?: string | null;
  badgeGold?: boolean | null;
  featured?: boolean;
  img: string;
  features: string[];
  itinerary: { day: string; title: string; activities?: string }[];
  inclusions: string[];
  exclusions: string[];
}

export interface Destination {
  id: string;
  name: string;
  type: string;
  altitude: string;
  img: string;
  big?: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  wide?: boolean;
  tall?: boolean;
  isHero?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  place: string;
  package: string;
  initial: string;
  text: string;
  stars: number;
  image?: string;
}
