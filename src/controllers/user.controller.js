
import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
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

        const encrypt = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: encrypt
        })

        return res.status(200).json({
            success: true,
            message: 'User Registered Successfully',
            user
        })

    } catch (error) {
        console.log(error)
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
        console.log(error)
    }
}

export const Logout = async (req, res) => {
    try {
        return res.cookie('token', '', { maxAge: 0 }).status(200).json({
            success: true,
            message: 'User Logout Successfully'
        })
    } catch (error) {
        console.log(error)
    }
}