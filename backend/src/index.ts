import express from "express";
import authRoutes from "./routes/auth.route"
import messageRoutes from "./routes/message.route"
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app, server, io} from "./lib/socket";

dotenv.config(); //for process.env. 


const PORT = parseInt(process.env.PORT || "5000", 10);

app.use(express.json()); //extract JSON Data from request.body
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5174"],
    credentials: true,
}))

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);


server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
})