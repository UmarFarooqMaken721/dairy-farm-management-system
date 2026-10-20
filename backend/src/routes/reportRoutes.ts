import { Router } from 'express';
import {
  getDailyReport,
  getMonthlyReport,
  getProfitLossReport,
  getCustomerReport,
  getDashboardSummary,
} from '../controllers/reportController';
import { protect } from '../middleware/auth';

const router = Router();
router.use(protect);

router.get('/daily', getDailyReport);
router.get('/monthly', getMonthlyReport);
router.get('/profit', getProfitLossReport);
router.get('/customers', getCustomerReport);
router.get('/summary', getDashboardSummary);

export default router;
