import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  slug: string;
  tagline: string;
  duration: string;
  price: number;
  badge: string;
  badgeGold: boolean;
  featured: boolean;
  img: string;
  features: string[];
  itinerary: any[];
  inclusions: string[];
  exclusions: string[];
  photos: string[];
  videos: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    tagline: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    badge: { type: String, default: '' },
    badgeGold: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    img: { type: String, default: '' },
    features: { type: [String], default: [] },
    itinerary: { type: Schema.Types.Mixed, default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    photos: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, id: true }
);

// Virtual for enquiries and reviews can be added if needed
PackageSchema.set('toJSON', { virtuals: true });
PackageSchema.set('toObject', { virtuals: true });

const Package: Model<IPackage> = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);

export default Package;
