import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  type: string;
  altitude: string;
  img: string;
  big: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    altitude: { type: String, required: true },
    img: { type: String, required: true },
    big: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Destination: Model<IDestination> = mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);

export default Destination;
