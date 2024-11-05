import jwt from "jsonwebtoken";
import { Response } from "express";

export const tokenGenerator = (res: Response, emailId: string): string => {
  const token = jwt.sign({ emailId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
