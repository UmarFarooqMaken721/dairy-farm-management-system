import { Response } from 'express';
import Sale from '../models/Sale';
import Customer from '../models/Customer';
import { AuthRequest } from '../middleware/auth';

export const createSale = async (req: AuthRequest, res: Response) => {
  try {
    const { customer, milkQty, rate, date, note } = req.body;
    if (!customer || !milkQty || !rate) {
      return res.status(400).json({ message: 'Customer, milk quantity, and rate are required' });
    }

    const calculatedAmount = req.body.amount ? Number(req.body.amount) : Number(milkQty) * Number(rate);

    const sale = await Sale.create({
      customer,
      milkQty: Number(milkQty),
      rate: Number(rate),
      amount: calculatedAmount,
      date: date ? new Date(date) : new Date(),
      note
    });

    // Add sale amount to customer balance (Udhaar barhana)
    await Customer.findByIdAndUpdate(customer, {
      $inc: { balance: calculatedAmount }
    });

    const populated = await sale.populate('customer');
    res.status(201).json(populated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getSales = async (req: AuthRequest, res: Response) => {
  try {
    const { customer } = req.query;
    const filter: any = {};
    if (customer) filter.customer = customer;

    const sales = await Sale.find(filter)
      .populate('customer')
      .sort({ date: -1 });
    res.json(sales);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSale = async (req: AuthRequest, res: Response) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale record not found' });

    // Reverse the balance impact on customer
    await Customer.findByIdAndUpdate(sale.customer, {
      $inc: { balance: -sale.amount }
    });

    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sale deleted and customer balance adjusted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
