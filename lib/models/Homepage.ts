import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHomepage extends Document {
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

const HomepageSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

const Homepage: Model<IHomepage> = mongoose.models.Homepage || mongoose.model<IHomepage>('Homepage', HomepageSchema);

export default Homepage;
