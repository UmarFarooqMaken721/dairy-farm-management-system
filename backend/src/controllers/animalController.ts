import { Response } from 'express';
import Animal from '../models/Animal';
import MilkRecord from '../models/MilkRecord';
import { AuthRequest } from '../middleware/auth';

export const getAnimals = async (req: AuthRequest, res: Response) => {
  try {
    const { type, status, search } = req.query;
    const filter: any = {};
    if (type && type !== 'all') filter.type = type;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { tagNumber: { $regex: search as string, $options: 'i' } },
        { breed: { $regex: search as string, $options: 'i' } },
      ];
    }
    const animals = await Animal.find(filter).sort({ createdAt: -1 });
    res.json(animals);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAnimalById = async (req: AuthRequest, res: Response) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Animal not found' });

    // Individual animal ka milk history
    const milkRecords = await MilkRecord.find({ animal: req.params.id }).sort({ date: -1 });
    const totalMilk = milkRecords.reduce((acc, r) => acc + (r.morningQty || 0) + (r.eveningQty || 0), 0);

    res.json({
      animal,
      totalMilk,
      milkRecords
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createAnimal = async (req: AuthRequest, res: Response) => {
  try {
    const animal = await Animal.create(req.body);
    res.status(201).json(animal);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateAnimal = async (req: AuthRequest, res: Response) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    res.json(animal);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteAnimal = async (req: AuthRequest, res: Response) => {
  try {
    await Animal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Animal deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};