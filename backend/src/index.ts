import express from "express";
import authRoutes from "./routes/auth.route.ts"
import messageRoutes from "./routes/message.route.ts"
import dotenv from "dotenv";
import { connectDB } from "./lib/db.ts";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server, io } from "./lib/socket.ts";
import path from "path";

dotenv.config(); //for process.env. 


const PORT = parseInt(process.env.PORT || "5000");
const __dirname = path.resolve();

app.use(express.json()); //extract JSON Data from request.body
app.use(cookieParser());
app.use(cors({
    origin: ["https://chat-app-e782.vercel.app/"],
    credentials: true,
}))

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV != "development") {
    console.log("on production:")
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });

}
server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
})