import express from 'express';
let authRouter = express.Router();
import { loginUser } from '../controller/userController.js';
import { resendOtpEmail,verifyOtp } from '../services/userService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


authRouter.post('/login', loginUser);
authRouter.post('/verify', verifyOtp);
authRouter.post('/resend-otp', resendOtpEmail);
export default authRouter;