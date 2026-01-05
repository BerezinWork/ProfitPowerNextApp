import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categories.controller';

const router = Router();

// Защищаем все маршруты ниже с помощью middleware checkAuth
// Теперь контроллеры будут знать, кто делает запрос
router.use(checkAuth);

router.get('/', getAllCategories);
router.post('/', createCategory);
router.patch('/:id', updateCategory); // PATCH используется для частичного обновления
router.delete('/:id', deleteCategory);

export default router;