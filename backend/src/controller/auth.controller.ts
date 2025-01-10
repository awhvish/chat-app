import { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import User from '../models/user.model';
import { generateToken } from '../lib/utils';
import cloudinary from '../lib/cloudinary';

export const signupController = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;

    try {
        if (password.length < 6) {
             res.status(400).json({ message: "Password must be at least 6 characters" });
             return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
             res.status(400).json({ message: "User with this email already exists" });
             return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPass,
        });

        await newUser.save();
        generateToken(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            image: newUser.image,
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred:", error.message);
            res.status(500).json({ message: "Internal server error" });
            return;
        } else {
            console.error("An unknown error occurred");
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    }
}

export const signinController = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({message: "Invalid credentials - no user"});
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            res.status(400).json({message: "Invalid credentials - no password"});
            return;
        }

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id, 
            email: user.email,
            fullName: user.fullName, 
            image: user.image,
        });
    } catch (error) {
        console.log("An error occured: " + error);
        res.status(500).json({message: "Internal server error"})

    }
}

export const logoutController = (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Successfully logged out"})

    } catch(error) {
        console.log("Error logging out: " + error);
        res.status(500).json({message: "Internal server error"})
    }
}

export const updateProfileController = async (req: Request, res: Response) => {
    try {
        const {profilePic} = req.body;

        if (!profilePic) {
            res.status(400).json({message: "Profile picture in required"});
        }

        const userId = req.user?._id;
    
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = User.findByIdAndUpdate(userId, {image: uploadResponse.secure_url}, {new: true});
        
        res.status(200).json(updatedUser);
        return;
    
    } catch(error) {
        console.log(`Error updating user: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }

}

export const checkAuthController = async (req: Request, res: Response) => {
    try {
        const user = req?.user;
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in checkAuth controller: " + error);
        res.status(500).json({message: "Internal server error"});

    }
}