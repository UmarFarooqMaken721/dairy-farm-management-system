import mongoose, { Schema, Document } from 'mongoose';

export interface IAnimal extends Document {
  tagNumber: string;
  name: string;
  type: 'cow' | 'buffalo';
  breed?: string;
  age?: number;
  purchaseDate?: Date;
  status: 'active' | 'sold' | 'dead';
}

const AnimalSchema = new Schema<IAnimal>({
  tagNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['cow', 'buffalo'], required: true },
  breed: String,
  age: Number,
  purchaseDate: Date,
  status: { type: String, enum: ['active', 'sold', 'dead'], default: 'active' },
}, { timestamps: true });

export default mongoose.model<IAnimal>('Animal', AnimalSchema);