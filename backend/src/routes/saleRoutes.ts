import { Router } from 'express';
import { createSale, getSales, deleteSale } from '../controllers/saleController';
import { protect } from '../middleware/auth';

const router = Router();
router.use(protect);

router.post('/', createSale);
router.get('/', getSales);
router.delete('/:id', deleteSale);

export default router;
