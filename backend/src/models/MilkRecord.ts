import mongoose, { Schema, Document } from 'mongoose';

export interface IMilkRecord extends Document {
  animal?: mongoose.Types.ObjectId;
  date: Date;
  morningQty: number;
  eveningQty: number;
  ratePerLiter: number;
}

const MilkSchema = new Schema<IMilkRecord>({
  animal: { type: Schema.Types.ObjectId, ref: 'Animal' },
  date: { type: Date, required: true },
  morningQty: { type: Number, default: 0 },
  eveningQty: { type: Number, default: 0 },
  ratePerLiter: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model<IMilkRecord>('MilkRecord', MilkSchema);