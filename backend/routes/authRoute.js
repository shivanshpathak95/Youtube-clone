import express from "express";
import upload from "../middleware/multer.js";
import { signUp, signIn, signOut } from "../controller/authController.js";

const authRoute = express.Router();

authRoute.post("/signup", upload.single("photoUrl"), signUp);
authRoute.post("/signin", signIn);
authRoute.post("/signout", signOut);

export default authRoute;