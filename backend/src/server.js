import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api",router)

const PORT = process.env.PORT || 5000;
const startServer = ()=>{
  app.listen(PORT,async ()=>{
  await connectDB();
  console.log("server is running on port:",PORT);
})
}

startServer();