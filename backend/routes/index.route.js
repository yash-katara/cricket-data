import express from "express";
let router = express.Router();
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";
import tournamentRouter from './tournament.route.js'

router.use("/user",userRouter);
router.use('/tournament',tournamentRouter);
router.use("/auth",authRouter);


export default router;
