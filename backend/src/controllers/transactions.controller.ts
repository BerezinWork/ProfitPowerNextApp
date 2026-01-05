import { Response } from 'express';
import { Transaction, Category } from '../models';
import { AuthRequest } from '../middlewares/checkAuth';

// --- CREATE ---
export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { amount, type, category: categoryId, date, description } = req.body;

        // 1. Валидация: Проверяем, существует ли такая категория и принадлежит ли она юзеру
        const categoryExists = await Category.findOne({ _id: categoryId, user: userId });

        // Если категории нет или она чужая — ошибка
        if (!categoryExists) {
            res.status(400).json({ message: 'Invalid category or access denied' });
            return;
        }

        // 2. Создаем транзакцию
        const newTransaction = await Transaction.create({
            user: userId,
            amount,
            type, // 'INCOME' или 'EXPENSE'
            category: categoryId,
            date: date || new Date(), // Если дату не передали, берем текущую
            description
        });

        // 3. Populate: Возвращаем фронту не просто ID категории, а объект с иконкой и названием
        // Это нужно, чтобы сразу красиво отобразить в списке
        await newTransaction.populate('category', 'name icon');

        res.status(201).json(newTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating transaction' });
    }
};

// --- DELETE ---
export const deleteTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;

        const deleted = await Transaction.findOneAndDelete({ _id: id, user: userId });

        if (!deleted) {
            res.status(404).json({ message: 'Transaction not found or access denied' });
            return;
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction' });
    }
};

// --- GET ALL (With Filters & Pagination) ---
export const getAllTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;

        // 1. Extract query parameters
        // Defaults: page 1, limit 10
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const { startDate, endDate, search, type, category } = req.query;

        // 2. Build the filter object dynamically
        const filter: any = { user: userId }; // Always filter by current user

        // Date Filter (Range)
        if (startDate || endDate) {
            filter.date = {};
            // $gte = Greater Than or Equal (>=)
            if (startDate) filter.date.$gte = new Date(startDate as string);
            // $lte = Less Than or Equal (<=)
            if (endDate) {
                // Fix: Set time to end of the day (23:59:59) to include transactions from that day
                const end = new Date(endDate as string);
                end.setHours(23, 59, 59, 999);
                filter.date.$lte = end;
            }
        }

        // Search by Description (Case-insensitive regex)
        if (search) {
            filter.description = { $regex: search, $options: 'i' };
        }

        // Filter by Type (INCOME / EXPENSE)
        if (type) {
            filter.type = type;
        }

        // Filter by Category ID
        if (category) {
            filter.category = category;
        }

        // 3. Execute Queries in Parallel
        // We need both the data list AND the total count for frontend pagination logic
        const [transactions, total] = await Promise.all([
            Transaction.find(filter)
                .sort({ date: -1 }) // Newest first
                .skip(skip)
                .limit(limit)
                .populate('category', 'name icon'),
            Transaction.countDocuments(filter)
        ]);

        // 4. Send Response with Pagination Metadata
        res.json({
            data: transactions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                hasMore: page * limit < total
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
};