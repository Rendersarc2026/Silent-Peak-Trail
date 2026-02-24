import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export type EnquiryStatus = "new" | "replied" | "confirmed" | "cancelled";

export interface Package {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  price: number;
  badge: string;
  badgeGold: boolean;
  featured: boolean;
  img: string;
  features: string[];
  itinerary?: { day: string; title: string; activities?: string }[];
  inclusions?: string[];
  exclusions?: string[];
}


export interface Enquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  package: string;
  travellers: string;
  month: string;
  budget: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  wide: boolean;
  tall: boolean;
}

export interface Destination {
  id: string;
  name: string;
  type: string;
  altitude: string;
  img: string;
  big: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  place: string;
  package: string;
  initial: string;
  text: string;
  stars: number;
}

export interface Settings {
  [key: string]: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  statsAltitude: string;
  statsPackages: string;
  statsTravellers: string;
  statsExperience: string;
  statsSatisfaction: string;
  phone: string;
  email: string;
  address: string;
  season: string;
}

export interface DB {
  packages: Package[];
  enquiries: Enquiry[];
  gallery: GalleryImage[];
  destinations: Destination[];
  testimonials: Testimonial[];
  settings: Settings;
}

export function readDB(): DB {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as DB;
}

export function writeDB(data: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
