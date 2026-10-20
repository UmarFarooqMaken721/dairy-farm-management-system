import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  category: 'chara' | 'dawa' | 'tankha' | 'bijli' | 'maintenance' | 'other';
  amount: number;
  date: Date;
  note?: string;
}

const ExpenseSchema = new Schema<IExpense>({
  category: { type: String, enum: ['chara', 'dawa', 'tankha', 'bijli', 'maintenance', 'other'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  note: String,
}, { timestamps: true });

export default mongoose.model<IExpense>('Expense', ExpenseSchema);