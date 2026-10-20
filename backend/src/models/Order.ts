import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  customerName: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  notes?: string;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, default: 'Liter' },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  notes: { type: String },
  deliveryDate: { type: Date },
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
