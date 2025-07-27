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


let active = new Array()
let found = false;

io.on('connection', (socket) => {
    console.log('a new user connected', socket.id)
    if (io.sockets) {
        const allSockets = Array.from(io.sockets.sockets.values());
        allSockets.map(s => {
            /* console.log('socket id:',s.id) */
        })
    }


    socket.on('join_room', async (roomID) => {
        const users = await io.in(roomID).fetchSockets()


        socket.join(roomID)

    })
    socket.on('message', async ({ roomID, message }) => {
        const users = await io.in(roomID).fetchSockets()

        console.log('All sockets in the room\n', users.length)
        io.to(roomID).emit('received', message)
    })

    socket.on('typing', ({ room, typing }) => {
        socket.to(room).emit('typing_message', typing)
    })

    socket.on('online', (userID) => {
        if (userID) {
            if (active.length <= 0) {
                active.push(userID)
            } else {
                for (let i = 0; i < active.length; i++) {
                    if ((active[i]._id === userID._id)) {
                        found = true
                    }
                }
                if (!found && userID.online === true) {
                    active.push(userID)
                }


                found = false

            }
        }
        io.emit('onlineUser', active)
    }
    )


    socket.on('disconnect', () => {
        console.log('socket is disconnected', socket.id)
        if (active && socket.id && active.length > 0) {
            const array = active.filter((online_users) => {
                return (
                    String(online_users.userID) !== String(socket.id)
                )
            })
            active = array

            io.emit('onlineUser', active)
        }

    })
})


connectDB();
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
