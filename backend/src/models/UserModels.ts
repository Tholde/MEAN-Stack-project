import {IUser} from "../types/IUser";
import mongoose, {Schema} from 'mongoose';
import bcrypt from "bcrypt";

const UserSchema: Schema = new Schema<IUser>(
    {
        firstname: {type: String, required: [true, "First name is required"], maxLength: 255},
        lastname: {type: String, default: null, maxLength: 255},
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid e-mail",
            ],
        },
        password: {
            type: String,
            trim: true,
            required: [true, "password is required"],
            minLength: [8, "Password must have at least (8) characters"],
        },
        role: {
            type: String,
            default: "user",
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpiresAt: {
            type: Date,
            default: null,
        },
        verificationToken: {
            type: String,
            default: null,
        },
        verificationExpiresAt: {
            type: String,
            default: null,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    },
    {timestamps: true}
);

//mot de pass crypté avant enregistration
UserSchema.pre<IUser>('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err as Error);
    }
});

export const UserModels = mongoose.model<IUser>("User", UserSchema);