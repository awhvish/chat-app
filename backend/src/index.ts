import express from "express";
import authRoutes from "./routes/auth.route"
import messageRoutes from "./routes/message.route"
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app, server, io} from "./lib/socket";
import path from "path";

dotenv.config(); //for process.env. 


const PORT = parseInt(process.env.PORT || "5000");
const __dirname = path.resolve();

app.use(express.json()); //extract JSON Data from request.body
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5174"],
    credentials: true,
}))

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
}

app.get("*",  (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
})