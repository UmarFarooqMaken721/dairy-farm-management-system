import { Response } from 'express';
import Customer from '../models/Customer';
import Sale from '../models/Sale';
import Payment from '../models/Payment';
import { AuthRequest } from '../middleware/auth';

export const getCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { phone: { $regex: search as string, $options: 'i' } },
      ];
    }
    const customers = await Customer.find(filter).sort({ createdAt: -1 });
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getCustomerById = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCustomer = async (req: AuthRequest, res: Response) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Customer Ledger (Khata) - Sales, Payments & Running Balance
export const getCustomerLedger = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const sales = await Sale.find({ customer: req.params.id }).sort({ date: 1 });
    const payments = await Payment.find({ customer: req.params.id }).sort({ date: 1 });

    interface LedgerEntry {
      id: string;
      date: Date;
      type: 'sale' | 'payment';
      description: string;
      debit: number; // Sale (balance increases)
      credit: number; // Payment (balance decreases)
      milkQty?: number;
      rate?: number;
      paymentMethod?: string;
      note?: string;
    }

    const entries: LedgerEntry[] = [];

    sales.forEach(s => {
      entries.push({
        id: s._id.toString(),
        date: s.date,
        type: 'sale',
        description: `Doodh Farokht (${s.milkQty} Ltr @ Rs ${s.rate})`,
        debit: s.amount,
        credit: 0,
        milkQty: s.milkQty,
        rate: s.rate,
        note: s.note
      });
    });

    payments.forEach(p => {
      entries.push({
        id: p._id.toString(),
        date: p.date,
        type: 'payment',
        description: `Raqam Vasooli (${p.paymentMethod.toUpperCase()})`,
        debit: 0,
        credit: p.amount,
        paymentMethod: p.paymentMethod,
        note: p.note
      });
    });

    // Sort chronologically
    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate running balance for each entry
    let runningBalance = 0;
    const ledgerWithBalance = entries.map(entry => {
      runningBalance += (entry.debit - entry.credit);
      return {
        ...entry,
        runningBalance
      };
    });

    const totalSales = sales.reduce((acc, s) => acc + s.amount, 0);
    const totalPayments = payments.reduce((acc, p) => acc + p.amount, 0);

    res.json({
      customer,
      totalSales,
      totalPayments,
      currentBalance: customer.balance,
      transactions: ledgerWithBalance.reverse() // show latest first for display
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};