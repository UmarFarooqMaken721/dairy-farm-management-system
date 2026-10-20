import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  customer: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  paymentMethod: 'cash' | 'jazzcash' | 'easypaisa' | 'bank';
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true, min: 1 },
  date: { type: Date, default: Date.now },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'jazzcash', 'easypaisa', 'bank'], 
    default: 'cash' 
  },
  note: { type: String },
}, { timestamps: true });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
