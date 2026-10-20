import { Router } from 'express';
import { getMilk, createMilk, deleteMilk } from '../controllers/milkController';
import { protect } from '../middleware/auth';
const router = Router();
router.use(protect);
router.get('/', getMilk);
router.post('/', createMilk);
router.delete('/:id', deleteMilk);
export default router;