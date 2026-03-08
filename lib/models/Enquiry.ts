import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiry extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  packageId: mongoose.Types.ObjectId;
  travellers: string;
  month: string;
  budget: string;
  message: string;
  status: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: false },
    travellers: { type: String, required: true },
    month: { type: String, required: true },
    budget: { type: String, required: true },
    message: { type: String, required: false },
    status: { type: String, default: 'new' }, // "new", "replied", "confirmed", "cancelled"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Enquiry: Model<IEnquiry> = mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
