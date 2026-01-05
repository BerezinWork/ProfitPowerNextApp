import { Response } from 'express';
import { Category } from '../models';
import { AuthRequest } from '../middlewares/checkAuth';

// --- GET ALL ---
export const getAllCategories = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        // Ищем категории, созданные этим юзером
        const categories = await Category.find({ user: userId });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

// --- CREATE ---
export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { name, icon } = req.body;

        // Проверяем дубликаты (именно у этого юзера)
        const existing = await Category.findOne({ name, user: userId });
        if (existing) {
            res.status(400).json({ message: 'Category with this name already exists' });
            return;
        }

        const newCategory = await Category.create({
            name,
            icon, // Может быть undefined, это ок
            user: userId,
            isSystem: false
        });

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category' });
    }
};

// --- UPDATE ---
export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;
        const { name, icon } = req.body;

        // Находим и обновляем. { new: true } вернет уже обновленный объект
        const updatedCategory = await Category.findOneAndUpdate(
            { _id: id, user: userId }, // Важно: ищем по ID И по UserID
            { name, icon },
            { new: true }
        );

        if (!updatedCategory) {
            res.status(404).json({ message: 'Category not found or access denied' });
            return;
        }

        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category' });
    }
};

// --- DELETE ---
export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;

        const deletedCategory = await Category.findOneAndDelete({ _id: id, user: userId });

        if (!deletedCategory) {
            res.status(404).json({ message: 'Category not found or access denied' });
            return;
        }

        // P.S. В будущем здесь нужно будет проверить, нет ли транзакций у этой категории.
        // Пока просто удаляем.

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
};