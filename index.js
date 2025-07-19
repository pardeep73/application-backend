import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import connectDB from './src/db/db.js';
import userRouter from './src/routes/user.routes.js';
import messageRouter from './src/routes/message.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import http from 'http'


dotenv.config({
    path: './.env', quiet: true
});


const port = process.env.PORT || 5000

const app = express();

const server = http.createServer(app)



const io = new Server(server, {
    cors: {
        origin: `${process.env.ORIGIN}`,
        credentials: true
    }
})

app.use(cors({
    origin: `${process.env.ORIGIN}`,
    credentials: true
}))
app.use(express.json({ limit: '100mb' }))
app.use(urlencoded({ limit: '100mb', extended: true }))
app.use(cookieParser())


app.use('/api/user', userRouter)
app.use('/api/message', messageRouter)



io.on('connection', (socket) => {
    console.log('a new user connected', socket.id)

    socket.on('join_room',async(roomID)=>{
        const users = await io.in(roomID).fetchSockets()

        console.log('All sockets in the room\n',users,users.length)
        socket.join(roomID)
        console.log('user joined the room ',roomID,socket.id)
    })
     socket.on('message',async({roomID,message})=>{
         const users = await io.in(roomID).fetchSockets()

        console.log('All sockets in the room\n',users,users.length)
        io.to(roomID).emit('received',message)
    })

    socket.on('typing',({room,typing})=>{
        socket.to(room).emit('typing_message',{typing})
    })


   
    socket.on('disconnected', () => {
        console.log('socket is disconnected')
    })
})


connectDB();
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
