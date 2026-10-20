import { Request, Response } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth';

// Public endpoint: Customers can place order from public website
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerName, phone, address, product, quantity, unit, totalAmount, notes, deliveryDate } = req.body;
    if (!customerName || !phone || !address || !product || !quantity || !totalAmount) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const order = await Order.create({
      customerName,
      phone,
      address,
      product,
      quantity,
      unit: unit || 'Liter',
      totalAmount,
      notes,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      status: 'pending'
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err: any) {
    res.status(400).json({ message: err.message || 'Error placing order' });
  }
};

// Admin endpoint: List orders with optional status filter
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Admin endpoint: Update order status (pending -> confirmed -> delivered -> cancelled)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, notes } = req.body;
    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Admin endpoint: Delete order
export const deleteOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
