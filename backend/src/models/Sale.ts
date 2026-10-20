import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
  customer: mongoose.Types.ObjectId;
  milkQty: number;
  rate: number;
  amount: number;
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SaleSchema = new Schema<ISale>({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  milkQty: { type: Number, required: true, min: 0.1 },
  rate: { type: Number, required: true, min: 1 },
  amount: { type: Number, required: true, min: 1 },
  date: { type: Date, default: Date.now },
  note: { type: String },
}, { timestamps: true });

export default mongoose.model<ISale>('Sale', SaleSchema);
