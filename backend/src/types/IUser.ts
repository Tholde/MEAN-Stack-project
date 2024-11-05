import {Document} from "mongoose";

export interface IUser extends Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
    resetPasswordToken: string|null;
    resetPasswordExpiresAt: Date|null;
    verificationToken: String|null;
    verificationExpiresAt: Date|null;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
    isModified: (field: string) => boolean;
}