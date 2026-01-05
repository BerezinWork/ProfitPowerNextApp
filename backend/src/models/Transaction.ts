import mongoose, { Schema, Document } from 'mongoose';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface ITransaction extends Document {
    amount: number;
    type: TransactionType;
    category: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    date: Date;
    description?: string;
}

const TransactionSchema: Schema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['INCOME', 'EXPENSE'],
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        maxLength: 500
    }
}, {
    timestamps: true
});

TransactionSchema.index({ user: 1, date: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);