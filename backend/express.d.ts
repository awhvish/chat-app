import { Types } from "mongoose";
import User from "./src/models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: Types.ObjectId; // Adjust the type as per your application, e.g., `mongoose.Types.ObjectId`
                email: string;
                fullName?: string;
                image?: string,
            };
        }
    }
}


