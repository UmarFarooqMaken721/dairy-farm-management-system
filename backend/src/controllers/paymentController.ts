import { Response } from 'express';
import Payment from '../models/Payment';
import Customer from '../models/Customer';
import { AuthRequest } from '../middleware/auth';

export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { customer, amount, date, paymentMethod, note } = req.body;
    if (!customer || !amount) {
      return res.status(400).json({ message: 'Customer and amount are required' });
    }

    const payment = await Payment.create({
      customer,
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'cash',
      note
    });

    // Deduct payment from customer balance (Udhaar kam karna)
    await Customer.findByIdAndUpdate(customer, {
      $inc: { balance: -Number(amount) }
    });

    const populated = await payment.populate('customer');
    res.status(201).json(populated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getPayments = async (req: AuthRequest, res: Response) => {
  try {
    const { customer } = req.query;
    const filter: any = {};
    if (customer) filter.customer = customer;

    const payments = await Payment.find(filter)
      .populate('customer')
      .sort({ date: -1 });
    res.json(payments);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePayment = async (req: AuthRequest, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Reverse the balance impact on customer
    await Customer.findByIdAndUpdate(payment.customer, {
      $inc: { balance: payment.amount }
    });

    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payment deleted and customer balance restored' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
