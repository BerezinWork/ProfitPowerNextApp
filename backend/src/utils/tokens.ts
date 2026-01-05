import jwt, { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateTokens = (userId: string | Types.ObjectId) => {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
        throw new Error("CRITICAL ERROR: JWT Secrets are not defined in .env file");
    }

    const id = userId.toString();

    // SENIOR APPROACH:
    // Мы берем тип прямо из библиотеки. Если библиотека обновится, наш код подстроится.
    const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as SignOptions['expiresIn'];
    const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as SignOptions['expiresIn'];

    const accessOptions: SignOptions = {
        expiresIn: accessExpiresIn
    };

    const refreshOptions: SignOptions = {
        expiresIn: refreshExpiresIn
    };

    const accessToken = jwt.sign(
        { userId: id },
        accessSecret,
        accessOptions
    );

    const refreshToken = jwt.sign(
        { userId: id },
        refreshSecret,
        refreshOptions
    );

    return { accessToken, refreshToken };
};