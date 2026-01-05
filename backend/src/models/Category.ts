import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    icon?: string; // Эмодзи (опционально)
    user?: mongoose.Types.ObjectId;
    isSystem: boolean;
}

const CategorySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isSystem: {
        type: Boolean,
        default: false
    }
});

CategorySchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', CategorySchema);