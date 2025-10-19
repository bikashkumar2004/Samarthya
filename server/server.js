import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();
import router from "./router/auth/authRoute.js";
import userrouter from "./router/auth/userRoute.js";
import contactLists from './router/admin/contactList.js'
import folder from "./router/admin/folderList.js"


mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!!"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.listen(port,()=>console.log(`server started on port:${port}`));
app.get('/',(req,res)=>res.send("API is working!"))

app.use("/api/auth",router)
app.use("/api/user",userrouter)
app.use("/api/admin/contactList",contactLists);
app.use("/api/admin/folder",folder)