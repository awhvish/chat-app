import jwt from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";

export const generateToken = ( userId: Types.ObjectId, res: Response) => {
    
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie("jwt", token, {
        maxAge: 1*24*60*60*1000,
        httpOnly: true, //prevent XSS cross-site scripting attacks
        sameSite: "strict",
        secure: process.env.NODE_ENV === "development" ? false : true,
    })

    return token;
}