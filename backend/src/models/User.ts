import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    name?: string;
    avatar?: string;
    createdAt: Date;
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
    name: {
        type: String
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);