import express from "express";
import { getall, Login, Logout, register, user } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";
import { cloudinaryURL } from "../middlewares/Cloudinary.js";

const userRouter = express.Router();

userRouter.route('/register').post(upload.single('image'),register)
userRouter.route('/login').post(Login)
userRouter.route('/logout').post(isAuthenticated,Logout)
userRouter.route('/all').post(isAuthenticated,getall)
userRouter.route('/single').post(isAuthenticated,user)

userRouter.route('/image').post(upload.single('image'),cloudinaryURL)

export default userRouter