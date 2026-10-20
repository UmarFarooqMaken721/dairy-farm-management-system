import { Router } from 'express';
import { createPayment, getPayments, deletePayment } from '../controllers/paymentController';
import { protect } from '../middleware/auth';

const router = Router();
router.use(protect);

router.post('/', createPayment);
router.get('/', getPayments);
router.delete('/:id', deletePayment);

export default router;
