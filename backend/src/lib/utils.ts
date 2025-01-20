import jwt from "jsonwebtoken";
import express from "express";
import { Types } from "mongoose";
import type { Response } from "express"; // Importing the type explicitly

export const generateToken = (userId: Types.ObjectId, res: Response) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true, // Prevent XSS cross-site scripting attacks
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
  });

  return token;
};
