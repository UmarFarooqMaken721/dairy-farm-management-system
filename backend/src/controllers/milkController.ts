import { Response } from 'express';
import MilkRecord from '../models/MilkRecord';
import { AuthRequest } from '../middleware/auth';

export const getMilk = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, animal } = req.query;
    const filter: any = {};

    if (animal) {
      filter.animal = animal;
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

    const records = await MilkRecord.find(filter).populate('animal').sort({ date: -1 });

    // Summary calculations
    const totalMorning = records.reduce((s, r) => s + (r.morningQty || 0), 0);
    const totalEvening = records.reduce((s, r) => s + (r.eveningQty || 0), 0);
    const totalMilk = totalMorning + totalEvening;
    const totalRevenue = records.reduce((s, r) => s + ((r.morningQty || 0) + (r.eveningQty || 0)) * (r.ratePerLiter || 0), 0);

    res.json({
      records,
      summary: {
        totalMorning,
        totalEvening,
        totalMilk,
        totalRevenue,
        avgRate: records.length > 0 ? (totalRevenue / (totalMilk || 1)) : 0
      }
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createMilk = async (req: AuthRequest, res: Response) => {
  try {
    const { animal, date, morningQty, eveningQty, ratePerLiter } = req.body;
    const record = await MilkRecord.create({
      animal: animal || undefined,
      date: date ? new Date(date) : new Date(),
      morningQty: Number(morningQty) || 0,
      eveningQty: Number(eveningQty) || 0,
      ratePerLiter: Number(ratePerLiter) || 0
    });
    const populated = await record.populate('animal');
    res.status(201).json(populated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteMilk = async (req: AuthRequest, res: Response) => {
  try {
    await MilkRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
