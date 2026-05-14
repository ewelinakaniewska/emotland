import express from "express";
import { getDbConnection } from "./db.js"
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/users.js";
import articleRouter from "./routes/articles.js";
import messageRouter from "./routes/messages.js";
import chapterRouter from "./routes/chapters.js"
import taskRouter from "./routes/tasks.js";
import userTaskRouter from "./routes/userTasks.js";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

getDbConnection()


const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cookieParser());
app.use(cors({
  origin: true,// "http://localhost:5173", 
  credentials: true,
}));
app.use(express.json());

app.use("/images", express.static("public/images"));

global.io = io;

io.on("connection", (socket) => {
  console.log("Nowy klient połączony:");


  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("Klient rozłączony:");
  });
});

app.use('/users', userRouter)

app.use('/articles', articleRouter)

app.use('/tasks', taskRouter)

app.use('/messages', messageRouter)

app.use('/userTasks', userTaskRouter)

app.use('/auth', authRouter)

app.use('/chapters', chapterRouter)

app.get("/", (req, res) => {
  res.send("Działa ");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));


