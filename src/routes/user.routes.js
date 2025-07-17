import express from "express";
import { getall, Login, Logout, register, user } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const userRouter = express.Router();

userRouter.route('/register').post(register)
userRouter.route('/login').post(Login)
userRouter.route('/logout').post(isAuthenticated,Logout)
userRouter.route('/all').post(isAuthenticated,getall)
userRouter.route('/single').post(isAuthenticated,user)

export default userRouter