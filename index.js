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
let index = null;

io.on('connection', (socket) => {
    console.log('a new user connected', socket.id)

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
        socket.to(room).emit('typing_message', { typing })
    })

    socket.on('online', (userID) => {
        if (userID) {
            if (active.length <= 0) {
                active.push(userID)
               /*  console.log('\nless than zero Condition', active, '\n') */
            } else {
                /* console.log('\nactive user Before', active, '\n') */
                for (let i = 0; i < active.length; i++) {
                    if ((active[i]._id === userID._id)) {
                        /* console.log('\nId matching', active, '\n') */
                        found = true
                    }

                    /* if (userID.online === false) {
                        console.log('offline user', userID)
                        if ((active[i]._id === userID._id)) {
                            index = i
                        }
                    }
                    if (index != null) {
                        active[i] = active[i + 1]
                    } */
                }
                if (!found && userID.online === true) {
                    active.push(userID)
                }


                found = false

            }
        }


        /* console.log('\nactive Users array After', active, '\n') */
        io.emit('onlineUser', active)
    }
    )


    socket.on('disconnected', () => {
        console.log('socket is disconnected')
    })
})


connectDB();
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
