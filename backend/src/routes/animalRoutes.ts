import { Router } from 'express';
import { 
  getAnimals, 
  getAnimalById, 
  createAnimal, 
  updateAnimal, 
  deleteAnimal 
} from '../controllers/animalController';
import { protect } from '../middleware/auth';

const router = Router();
router.use(protect);

router.get('/', getAnimals);
router.get('/:id', getAnimalById);
router.post('/', createAnimal);
router.put('/:id', updateAnimal);
router.delete('/:id', deleteAnimal);

export default router;