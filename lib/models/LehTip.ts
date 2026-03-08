import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILehTip extends Document {
  icon: string;
  title: string;
  desc: string;
  color: string;
  border: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LehTipSchema: Schema = new Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    color: { type: String, required: true },
    border: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const LehTip: Model<ILehTip> = mongoose.models.LehTip || mongoose.model<ILehTip>('LehTip', LehTipSchema);

export default LehTip;
