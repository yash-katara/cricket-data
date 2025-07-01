import express from "express";
let router = express.Router();
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";

router.use("/user",userRouter);
router.use("/auth",authRouter);


export default router;
