// User Entity
export interface IUser {
    id: string;
    email: string;
    name?: string;
    createdAt: string;
}

// Transaction Entity
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface ITransaction {
    id: string;
    amount: number;
    type: TransactionType;
    category: ICategory; // Populated category
    date: string; // ISO Date
    description?: string;
    userId: string;
}

// Category Entity
export interface ICategory {
    id: string;
    name: string;
    icon?: string;
    color?: string;
    userId: string;
    isSystem?: boolean; // If we have default categories
}

// API Responses
export interface AuthResponse {
    accessToken: string;
    user: IUser;
}

export interface ApiError {
    message: string;
    statusCode?: number;
}