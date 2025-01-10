import express from "express";
import authRoutes from "./routes/auth.route"
import messageRoutes from "./routes/message.route"
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config(); //for process.env. 


const PORT = process.env.PORT;

app.use(express.json()); //extract JSON Data from request.body
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
})