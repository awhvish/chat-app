import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { Response, Request, NextFunction } from 'express';

export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.jwt;

        if (!token) {
            res.status(401).json({ message: "Unauthorized - no token provided" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as jwt.JwtPayload;

        if (!decoded || !decoded.userId) {
            res.status(401).json({ message: "Unauthorized - Invalid token provided" });
            return;
        }

        const user = await User.findById(decoded.userId).select("-password");


        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        req.user = user; // Attach the user to the request

        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error instanceof Error ? error.message : error);
        res.status(500).json({ message: "Internal server error" });
    }
};
