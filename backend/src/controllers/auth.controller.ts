import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { User, Category } from '../models';
import { generateTokens } from '../utils/tokens';

const COOKIE_NAME = 'refreshToken';

// --- REGISTER ---
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        // Changed: extract nickname instead of name
        const { email, password, nickname } = req.body;

        // 1. Check if email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User with this email already exists' });
            return;
        }

        // 2. Check if nickname exists (New logic)
        const existingNickname = await User.findOne({ nickname });
        if (existingNickname) {
            res.status(400).json({ message: 'Nickname is already taken' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Create user with nickname
        const newUser = await User.create({
            email,
            passwordHash,
            nickname, // Save nickname to DB
        });

        const defaultCategories = [
            { name: 'Groceries', icon: '🛒', isSystem: false, user: newUser._id },
            { name: 'Transport', icon: '🚌', isSystem: false, user: newUser._id },
            { name: 'Salary', icon: '💰', isSystem: false, user: newUser._id },
        ];
        await Category.insertMany(defaultCategories);

        const { accessToken, refreshToken } = generateTokens(newUser._id);

        res.cookie(COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        // Return nickname in response
        res.status(201).json({
            user: {
                id: newUser._id,
                email: newUser.email,
                nickname: newUser.nickname,
            },
            accessToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// --- LOGIN ---
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        res.cookie(COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        // Return nickname in response
        res.json({
            user: {
                id: user._id,
                email: user.email,
                nickname: user.nickname, // Changed from name to nickname
            },
            accessToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// --- LOGOUT ---
export const logout = (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ message: 'Logged out successfully' });
};

// --- REFRESH ---
export const refresh = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.cookies;
        const refreshSecret = process.env.JWT_REFRESH_SECRET;
        const accessSecret = process.env.JWT_ACCESS_SECRET;

        if (!accessSecret || !refreshSecret) {
            throw new Error('JWT Secrets are not defined in .env');
        }

        if (!refreshToken) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const userData = jwt.verify(refreshToken, refreshSecret) as JwtPayload;

        const user = await User.findById(userData.userId);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as SignOptions['expiresIn'];

        const accessOptions: SignOptions = {
            expiresIn: accessExpiresIn
        };

        const newAccessToken = jwt.sign(
            { userId: user._id.toString() },
            accessSecret,
            accessOptions
        );

        res.json({ accessToken: newAccessToken });

    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};