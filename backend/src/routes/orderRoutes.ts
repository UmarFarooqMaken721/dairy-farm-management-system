import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus, deleteOrder } from '../controllers/orderController';
import { protect } from '../middleware/auth';

const router = Router();

// Public route for placing orders from website
router.post('/', createOrder);

// Protected routes for admin management
router.get('/', protect, getOrders);
router.put('/:id', protect, updateOrderStatus);
router.delete('/:id', protect, deleteOrder);

export default router;
