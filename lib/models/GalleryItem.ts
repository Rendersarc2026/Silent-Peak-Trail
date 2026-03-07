import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryItem extends Document {
  src: string;
  alt: string;
  wide: boolean;
  tall: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema: Schema = new Schema(
  {
    src: { type: String, required: true, unique: true },
    alt: { type: String, default: '' },
    wide: { type: Boolean, default: false },
    tall: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GalleryItem: Model<IGalleryItem> = mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);

export default GalleryItem;
