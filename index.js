import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import connectDB from './src/db/db.js';
import userRouter from './src/routes/user.routes.js';
import messageRouter from './src/routes/message.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';


dotenv.config({
    path: './.env'
});


const app = express();

app.use(cors({
    origin: '',
    credentials: true
}))
app.use(express.json({ limit: '100mb' }))
app.use(urlencoded({ limit: '100mb',extended:true }))
app.use(cookieParser())


app.use('/api/user', userRouter)
app.use('/api/message', messageRouter)

connectDB();
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
