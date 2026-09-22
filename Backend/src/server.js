import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import leadRoutes from "./routes/lead.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Business Assistant API is running",
  });
});

app.use("/api/chat", chatRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🍃 MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();