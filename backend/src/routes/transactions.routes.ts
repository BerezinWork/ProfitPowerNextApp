import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import {
    createTransaction,
    deleteTransaction,
    getAllTransactions
} from '../controllers/transactions.controller';

const router = Router();

router.use(checkAuth);

router.get('/', getAllTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);

export default router;