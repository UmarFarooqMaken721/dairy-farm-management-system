import { Response } from 'express';
import Animal from '../models/Animal';
import MilkRecord from '../models/MilkRecord';
import Expense from '../models/Expense';
import Customer from '../models/Customer';
import Sale from '../models/Sale';
import Order from '../models/Order';
import Payment from '../models/Payment';
import { AuthRequest } from '../middleware/auth';

// Daily Report (R-01)
export const getDailyReport = async (req: AuthRequest, res: Response) => {
  try {
    const targetDate = req.query.date ? new Date(req.query.date as string) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const [milkRecords, sales, expenses, payments] = await Promise.all([
      MilkRecord.find({ date: { $gte: startOfDay, $lte: endOfDay } }).populate('animal'),
      Sale.find({ date: { $gte: startOfDay, $lte: endOfDay } }).populate('customer'),
      Expense.find({ date: { $gte: startOfDay, $lte: endOfDay } }),
      Payment.find({ date: { $gte: startOfDay, $lte: endOfDay } }).populate('customer'),
    ]);

    const totalMilkMorning = milkRecords.reduce((acc, r) => acc + (r.morningQty || 0), 0);
    const totalMilkEvening = milkRecords.reduce((acc, r) => acc + (r.eveningQty || 0), 0);
    const totalMilkCollected = totalMilkMorning + totalMilkEvening;

    const totalSalesAmount = sales.reduce((acc, s) => acc + s.amount, 0);
    const totalExpensesAmount = expenses.reduce((acc, e) => acc + e.amount, 0);
    const totalPaymentsReceived = payments.reduce((acc, p) => acc + p.amount, 0);
    const netProfit = totalSalesAmount - totalExpensesAmount;

    res.json({
      date: targetDate,
      totalMilkCollected,
      totalMilkMorning,
      totalMilkEvening,
      totalSalesAmount,
      totalExpensesAmount,
      totalPaymentsReceived,
      netProfit,
      milkRecords,
      sales,
      expenses,
      payments,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Monthly Report & Chart Data (R-02)
export const getMonthlyReport = async (req: AuthRequest, res: Response) => {
  try {
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
    const month = req.query.month !== undefined ? Number(req.query.month) : new Date().getMonth(); // 0-indexed

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const [milkRecords, sales, expenses] = await Promise.all([
      MilkRecord.find({ date: { $gte: startOfMonth, $lte: endOfMonth } }),
      Sale.find({ date: { $gte: startOfMonth, $lte: endOfMonth } }),
      Expense.find({ date: { $gte: startOfMonth, $lte: endOfMonth } }),
    ]);

    const totalMilk = milkRecords.reduce((acc, r) => acc + (r.morningQty || 0) + (r.eveningQty || 0), 0);
    const totalSales = sales.reduce((acc, s) => acc + s.amount, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = totalSales - totalExpenses;

    // Category breakdown
    const categoryExpenses: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryExpenses[e.category] = (categoryExpenses[e.category] || 0) + e.amount;
    });

    // 6-Month historical trend
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - i, 1);
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const [mRecords, mSales, mExpenses] = await Promise.all([
        MilkRecord.find({ date: { $gte: mStart, $lte: mEnd } }),
        Sale.find({ date: { $gte: mStart, $lte: mEnd } }),
        Expense.find({ date: { $gte: mStart, $lte: mEnd } }),
      ]);

      const milkLiters = mRecords.reduce((acc, r) => acc + (r.morningQty || 0) + (r.eveningQty || 0), 0);
      const income = mSales.reduce((acc, s) => acc + s.amount, 0);
      const expense = mExpenses.reduce((acc, e) => acc + e.amount, 0);

      const monthName = d.toLocaleString('default', { month: 'short' });
      monthlyTrends.push({
        name: monthName,
        milk: milkLiters,
        income,
        expense,
        profit: income - expense,
      });
    }

    res.json({
      year,
      month,
      totalMilk,
      totalSales,
      totalExpenses,
      netProfit,
      categoryExpenses,
      monthlyTrends,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Profit / Loss Report (R-03)
export const getProfitLossReport = async (req: AuthRequest, res: Response) => {
  try {
    const allSales = await Sale.find();
    const allExpenses = await Expense.find();

    const totalIncome = allSales.reduce((acc, s) => acc + s.amount, 0);
    const totalExpenses = allExpenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0';

    res.json({
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin: `${profitMargin}%`,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Customer Udhaar Report (R-05)
export const getCustomerReport = async (req: AuthRequest, res: Response) => {
  try {
    const customers = await Customer.find().sort({ balance: -1 });
    const totalPendingReceivables = customers.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0);
    const customersWithBalance = customers.filter((c) => c.balance > 0);

    res.json({
      totalPendingReceivables,
      debtorCount: customersWithBalance.length,
      debtors: customersWithBalance,
      allCustomers: customers,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Summary for Dashboard
export const getDashboardSummary = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999);

    const [
      totalAnimals,
      cowsCount,
      buffalosCount,
      todayMilkRecords,
      allExpenses,
      totalCustomers,
      pendingOrders,
      todaySales,
    ] = await Promise.all([
      Animal.countDocuments({ status: 'active' }),
      Animal.countDocuments({ type: 'cow', status: 'active' }),
      Animal.countDocuments({ type: 'buffalo', status: 'active' }),
      MilkRecord.find({ date: { $gte: today, $lte: endToday } }),
      Expense.find(),
      Customer.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Sale.find({ date: { $gte: today, $lte: endToday } }),
    ]);

    const milkToday = todayMilkRecords.reduce((acc, r) => acc + (r.morningQty || 0) + (r.eveningQty || 0), 0);
    const todaySalesAmount = todaySales.reduce((acc, s) => acc + s.amount, 0);
    const totalExpenses = allExpenses.reduce((acc, e) => acc + e.amount, 0);

    // Recent 5 activity items (latest orders and sales)
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      animals: totalAnimals,
      cows: cowsCount,
      buffalos: buffalosCount,
      milkToday,
      todaySalesAmount,
      totalExpenses,
      customers: totalCustomers,
      pendingOrders,
      recentOrders,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
