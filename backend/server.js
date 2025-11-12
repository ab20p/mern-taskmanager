import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", taskRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
