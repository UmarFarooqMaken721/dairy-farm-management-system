import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  phone: string;
  address?: string;
  balance: number;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  balance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<ICustomer>('Customer', CustomerSchema);