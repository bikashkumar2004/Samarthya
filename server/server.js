import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

// 🧩 Import routes
import router from "./router/auth/authRoute.js";
import userrouter from "./router/auth/userRoute.js";
import contactLists from "./router/agent/contactList.js";
import uploadData from "./router/createTask/index.js";
import campaignRoutes  from './router/campaign/campaigns.js'


mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

const app = express();
const port = process.env.PORT || 4000;


app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // ✅ allow cookies & auth headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
  })
);

app.get("/", (req, res) => res.send("✅ API is working!"));

app.use("/api/auth", router);
app.use("/api/user", userrouter);
app.use("/api/agent/contactList", contactLists);
app.use("/api/agent/create-task", uploadData);
app.use('/api/campaigns', campaignRoutes);
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


app.listen(port, () => console.log(` Server started on port: ${port}`));
