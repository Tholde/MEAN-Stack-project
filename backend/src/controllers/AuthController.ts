import express from "express";
import {ErrorResponse} from "../utils/ErrorResponse";
import {UserModels} from "../models/UserModels";
import {tokenGenerator} from "../token/tokenGenerator";
import {mailOptions} from "../mailer/mailer";
import {VERIFICATION_EMAIL_TEMPLATE} from "../mailer/template/AuthVerificationTemplate";
import {sendEmail} from "../mailer/sendEmail";
import {IUser} from "../types/IUser";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {WELLCOME_EMAIL_TEMPLATE} from "../mailer/template/WelcomeTemplate";
import {PASSWORD_RESET_REQUEST_TEMPLATE} from "../mailer/template/ResetPasswordTemplate";
import bcrypt from "bcrypt";
import {PASSWORD_RESET_SUCCESS_TEMPLATE} from "../mailer/template/CongratulationTemplate";
import exp from "node:constants";


/**
 * Authentication pour les users.
 * parametres commun :
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function pour error handling
 */
export const signup = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
        const {email} = req.body;
        const checkUser = await UserModels.findOne({email})
        if (checkUser) {
            return next(new ErrorResponse("Email already exist", 400));
        }
        req.body.role = "user"; // izay manao signup rehetra dia tsy maintsy user aby fa n admin ihany no afaka manova azy ho user
        req.body.isActive = false; // preciser-na ho tsy activer aby
        req.body.verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        req.body.verificationExpiresAt = Date.now() + 4 * 60 * 60 * 1000; //15min
        // let user:IUser = new UserModels(req.body) as IUser;
        let user = await UserModels.create(req.body) as IUser;
        tokenGenerator(res, email);
        const subject: string = "Verify your email";
        const category: string = "Email Verification";
        //const mailOptions = mailOptions(req.body.email, req.body.name, VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", req.body.verificationToken))
        await sendEmail(mailOptions(req.body.email, req.body.firstname.toUpperCase(), subject, category, VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", req.body.verificationToken)));
        res.status(201).json({
            status: "success",
            user,
        });
    } catch (e) {
        next(e);
    }
};

export const verification = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const {code} = req.body;
        const user: IUser = await UserModels.findOne({verificationToken: code}) as IUser;
        if (!user) res.status(400).json({success: false, message: "Invalid or expired verification code"});
        console.log("user:", user);
        Object.assign(user, {isActive: true, verificationToken: undefined, verificationExpiresAt: undefined});
        await user.save();
        const subject: string = "Verification Successfully";
        const category: string = "Email Welcome";
        await sendEmail(mailOptions(user.email, user.firstname.toUpperCase(), subject, category, WELLCOME_EMAIL_TEMPLATE.replace("{name}", user.firstname.toUpperCase)));
        res.status(200).json({success: true, message: "Email verified successfully.", user: user});
    } catch (error) {
        next(error);
    }
}

export const signin = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    try {
        const {email, password} = req.body;
        const tokenExist = req.cookies.token;
        console.log("Cookies:", req.cookies);
        if (!tokenExist) {
            const checkUser: IUser = await UserModels.findOne({email: email}) as IUser;
            if (!checkUser) res.status(400).json({success: false, message: "User not found. Verify your email"});
            const isPasswordMatch = await bcryptjs.compare(password, checkUser.password);
            if (!isPasswordMatch) res.status(400).json({success: false, message: "Invalid password!"});
            const token = tokenGenerator(res, email)
            console.log("Generated Token:", token);
            checkUser.lastLogin = new Date();
            await checkUser.save();
            res.status(200).json({success: true, message: "Logged in successfully", user: checkUser})
        } else {
            const decoded = jwt.decode(tokenExist)
            if (decoded && typeof decoded !== 'string') {
                console.log(decoded.emailId)
                const user: IUser = await UserModels.findOne({email: decoded.emailId}) as IUser;
                res.status(200).json({success: false, message: "User already logged in", user: user});
            }
        }
    } catch (err) {
        next(err);
    }
}

export const forgetPassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {email} = req.body;
        const user: IUser = await UserModels.findOne({email: email}) as IUser;
        if (!user) res.status(400).json({success: false, message: "User not found. Verify your email"});
        //const resetToken = crypto.randomBytes(20).toString("hex");
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
        user.resetPasswordToken = code;
        user.resetPasswordExpiresAt = new Date(resetTokenExpiresAt);
        await user.save();
        const subject: string = "Verification code of Reset Password";
        const category: string = "Reset Password Email";
        await sendEmail(mailOptions(user.email, user.firstname.toUpperCase(), subject, category, PASSWORD_RESET_REQUEST_TEMPLATE.replace("{code}", code)))
        res.status(200).json({success: true, message: "Code sent successfully.!"})
    } catch (e) {
        next(e);
    }
}
export const resetPasswordCode = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {code} = req.body;
        const user: IUser = await UserModels.findOne({
            resetPasswordToken: code,
            resetPasswordExpiresAt: {$gt: Date.now()}
        }) as IUser;
        if (!user) res.status(400).json({success: false, message: "Invalid or expired verification code"});
        res.status(200).json({success: true, message: "Code accepted.!", user: user})
    } catch (e) {
        next(e)
    }
}
export const resetPassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const id: string = req.params.id;
        const {password, confirm_password} = req.body;
        const user: IUser = await UserModels.findOne({_id: id}) as IUser;
        if (!user) res.status(400).json({success: false, message: "User not found"});
        if (password === confirm_password) {
            const pass = await bcrypt.hash(password, 10);
            Object.assign(user, {password: pass, resetPasswordToken: undefined, resetPasswordExpiresAt: undefined});
            await user.save();
            const subject: string = "Verification code of Reset Password";
            const category: string = "Reset Password Email";
            await sendEmail(mailOptions(user.email, user.firstname.toUpperCase(), subject, category, PASSWORD_RESET_SUCCESS_TEMPLATE))
            res.status(200).json({success: true, message: "Password reset successfully.!"})
        } else {
            res.status(400).json({success: true, message: "Verify your password and her confirmation.!"})
        }
    } catch (e) {
        next(e)
    }
}

export const logout = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const tokenExist = req.cookies.token;
    if (tokenExist) {
        console.log("Cookies:", req.cookies);
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: new Date(0)
        });
        console.log("Token cleared.");
        res.status(200).json({success: true, message: "Logged out successfully.!"});
    } else {
        res.status(500).json({message: "Unable to log in"});
    }
}