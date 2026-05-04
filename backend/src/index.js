import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import connectDb from "./config/db.js";
import registrationsRouter from "./routes/registrations.js";
import candidatesRouter from "./routes/candidates.js";
import staffRouter from "./routes/staff.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

connectDb();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/ping", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.json({
    success: true,
    message: "Aurudu backend is active.",
    database: dbStatus
  });
});

app.use("/api/registrations", registrationsRouter);
app.use("/api/candidates", candidatesRouter(io));
app.use("/api/staff", staffRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  });
});
