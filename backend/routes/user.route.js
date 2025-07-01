import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getUserController,updateUserController,addUserController,changePasswordController } from '../controller/userController.js';

let userRouter = express.Router();

userRouter.get('/getuser',authMiddleware, getUserController);
userRouter.post('/adduser', addUserController);
userRouter.put('/updateuser/:id', authMiddleware, updateUserController);
userRouter.put('/changepassword', authMiddleware, changePasswordController);

export default userRouter;