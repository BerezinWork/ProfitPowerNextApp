import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    nickname: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);