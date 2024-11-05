import {UserModels} from "../models/UserModels";
import bcryptjs from "bcryptjs";
import {Request, Response, NextFunction} from "express";
import {IUser} from "../types/IUser";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body) {
            res.status(400).json({message: "Invalid input"});
        }
        console.log(req.body);
        const {name, email, password, age, address} = req.body;

        const check_user = await UserModels.findOne({email: email});
        if (check_user) {
            res.status(401).json({message: "User already exists"});
        } else {
            const hashedPass = await bcryptjs.hash(password, 10);
            const user = new UserModels({
                name,
                email,
                password: hashedPass,
                age: parseInt(age),
                address,
            });
            await user.save();
            console.log("mandalo eto")
            res.status(201).json(user);
        }
    } catch (error) {
        next(error);
    }
};
export const readOneUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUser = await UserModels.findOne({_id: req.params.id}) as IUser;
        if (user) {
            console.log(user);
            res.status(200).send(`Hello from ${user}!`);
        }else {
            res.status(500).send('User not found!')
        }
    } catch (error) {
        next(error)
    }
};
export const readUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserModels.find();
        for (const userKey in user) {
            console.log(userKey);
        }
        res.status(200).json({user: user});
    } catch (error) {
        next(error)
    }
};
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUser = await UserModels.findOne({_id: req.params.id}) as IUser;
        if (!user) res.status(400).json({message: "User does not exist"});
        res.status(200).json({message: "User updated successfully"});
    } catch (e) {
        next(e);
    }
}
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: IUser = await UserModels.findOne({_id: req.params.id}) as IUser;
        if (!user) res.status(400).json({message: "User does not exist"});
        else {
            user.deleteOne({_id: req.params.id});
            res.status(200).json({message: "User deleted successfully"});
        }
    } catch (e) {
        next(e);
    }
}
