import { Response } from 'express';
import Expense from '../models/Expense';
import { AuthRequest } from '../middleware/auth';

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const { category, startDate, endDate } = req.query;
    const filter: any = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        const start = new Date(startDate as string);
        start.setHours(0, 0, 0, 0);
        filter.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    // Category breakdown
    const categoryTotals: Record<string, number> = {
      chara: 0,
      dawa: 0,
      tankha: 0,
      bijli: 0,
      maintenance: 0,
      other: 0,
    };

    let totalAmount = 0;
    expenses.forEach((e) => {
      totalAmount += e.amount;
      if (categoryTotals[e.category] !== undefined) {
        categoryTotals[e.category] += e.amount;
      } else {
        categoryTotals.other += e.amount;
      }
    });

    res.json({
      expenses,
      totalAmount,
      categoryTotals,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { category, amount, date, note } = req.body;
    if (!category || !amount) {
      return res.status(400).json({ message: 'Category and amount are required' });
    }

    const expense = await Expense.create({
      category,
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      note,
    });
    res.status(201).json(expense);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};