import { Request, Response } from 'express';
import User from '../models/user.model';
import Message from '../models/message.model';
import cloudinary from '../lib/cloudinary';
import mongoose from 'mongoose';

export const getUserForSidebar = async (req:Request, res: Response) => {
    
    try {
        const loggedInUserId = req.user?._id;
        const filteredUsers = await User.find({ _id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
        return;
    } catch (error) {
        console.log("Error in message controller: " + error);
        res.status(500).json({message: "Internal server error"});
    }

}

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { id: userToChatId } = req.params; 
        const myId = req.user?._id;

        if (!userToChatId || !myId || !mongoose.Types.ObjectId.isValid(userToChatId) || !mongoose.Types.ObjectId.isValid(myId)) {
            res.status(400).json({ message: "Invalid user ID(s)" });
            return;
        }


        const myObjectId = new mongoose.Types.ObjectId(myId);
        const userToChatObjectId = new mongoose.Types.ObjectId(userToChatId);

        const messages = await Message.find({
            $or: [
                { senderId: myObjectId, receiverId: userToChatObjectId },
                { senderId: userToChatObjectId, receiverId: myObjectId }
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { text, image } = req.body;
        const  {id: receiverId} = req.params;
        const senderId = req.user?._id;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage =  new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageUrl,
        })

        await newMessage.save();

        //TODO: add realtime functionality

        res.status(200).json(newMessage);

    }
    
    catch(error) {
        console.log("Error in sendMessage controller: " + error);
        res.status(500).json("Internal server error");
    }
    
}