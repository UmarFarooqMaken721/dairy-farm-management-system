import { Router } from 'express';
import { getExpenses, createExpense, deleteExpense } from '../controllers/expenseController';
import { protect } from '../middleware/auth';
const router = Router();
router.use(protect);
router.get('/', getExpenses);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);
export default router;