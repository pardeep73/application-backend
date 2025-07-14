import express from "express";
import { Login, Logout, register } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const userRouter = express.Router();

userRouter.route('/register').post(register)
userRouter.route('/login').post(Login)
userRouter.route('/logout').post(isAuthenticated,Logout)

export default userRouter