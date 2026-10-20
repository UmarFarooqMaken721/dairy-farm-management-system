import { Router } from 'express';
import { 
  getCustomers, 
  getCustomerById, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer, 
  getCustomerLedger 
} from '../controllers/customerController';
import { protect } from '../middleware/auth';

const router = Router();
router.use(protect);

router.get('/', getCustomers);
router.get('/:id/ledger', getCustomerLedger);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;