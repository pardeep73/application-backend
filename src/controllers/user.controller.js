
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cloudinaryURL } from "../middlewares/Cloudinary.js";
import { Image } from "../models/profileImage.model.js";

export const register = async (req, res) => {
    try {
        
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error'
            })
        }

        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.json({
                status: 400,
                success: false,
                message: 'User already Existed'
            })
        }

        const imageData = await cloudinaryURL(req, req)

        if (!imageData) {
            return res.json({
                status: 400,
                success: false,
                message: 'Cloudinary image Data not Received'
            })
        }

        const profilePicture = await Image.create(imageData)

        if (!profilePicture) {
            return res.json({
                status: 400,
                success: false,
                message: 'Image Upload Failed'
            })
        }

        const encrypt = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: encrypt,
            profilePicture: profilePicture._id
        })

        return res.status(200).json({
            success: true,
            message: 'User Registered Successfully',
            user
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Validation error',
                success: false
            })
        }

        const existeduser = await User.findOne({ email });
        if (!existeduser) {
            return res.json({
                status: 400,
                success: false,
                message: 'Email Doesnot exist'
            })
        }

        const comparepassword = await bcrypt.compare(password, existeduser.password);
        if (!comparepassword) {
            return res.json({
                status: 400,
                message: 'Incorrect Password',
                success: false
            })
        }

        const token = await jwt.sign(
            {
                userId: existeduser._id
            }
            , process.env.SECRET_KEY,
            {
                expiresIn: '1d'
            }
        )
        return res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 1 * 24 * 60 * 60 * 1000 }).status(200).json({
            success: true,
            message: 'Login Successfull'
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}

export const Logout = async (req, res) => {
    try {
        return res.cookie('token', '', { maxAge: 0 }).status(200).json({
            success: true,
            message: 'User Logout Successfully'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}

export const getall = async (req, res) => {
    try {
        const senderId = req.id
        const users = await User.find({ _id: { $ne: senderId } }).select('-password').populate('profilePicture');

        if (!users) {
            return res.json({
                status: 400,
                success: false,
                message: 'users not found'
            })
        }

        return res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}


export const user = (req, res) => {
    try {
        const user = req.id

        if (!user) {
            return res.json({
                status: 400,
                success: false,
                message: 'users not found'
            })
        }

        return res.json({
            status: 200,
            success: true,
            user: user
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}