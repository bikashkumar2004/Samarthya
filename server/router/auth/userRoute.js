import express from "express";

import userVerified from "../../controller/auth/userVerified.js";
import { authMiddleware } from "../../controller/auth/authController.js";

const userrouter = express.Router();

userrouter.get("/data", authMiddleware, userVerified);

export default userrouter;
