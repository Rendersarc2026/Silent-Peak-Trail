import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  name: string;
  place: string;
  packageId: mongoose.Types.ObjectId;
  initial: string;
  rating: number;
  message: string;
  image?: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    place: { type: String, required: true },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
    initial: { type: String, required: true },
    rating: { type: Number, default: 5 },
    message: { type: String, required: true },
    image: { type: String },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
