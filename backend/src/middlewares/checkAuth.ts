import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Расширяем стандартный запрос Express, добавляя туда поле userId
export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        // Ждем токен в заголовке: "Authorization: Bearer <token>"
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'No authorization token found' });
            return;
        }

        const secret = process.env.JWT_ACCESS_SECRET;
        if (!secret) {
            throw new Error('JWT Access Secret is not defined');
        }

        // Декодируем токен
        const decoded = jwt.verify(token, secret) as { userId: string };

        // Кладем ID юзера в запрос, чтобы контроллеры могли им пользоваться
        req.user = { id: decoded.userId };

        next(); // Пропускаем запрос дальше к контроллеру
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};