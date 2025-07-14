import express from "express";
import { createMessage, getallusermessages, getMessagesofReceiver, getMessagesofSender } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const messageRouter = express.Router();

messageRouter.route('/create/:id').post(isAuthenticated,createMessage)
messageRouter.route('/sender').post(isAuthenticated,getMessagesofSender)
messageRouter.route('/receiver/:id').post(isAuthenticated,getMessagesofReceiver)
messageRouter.route('/getall/:id').post(isAuthenticated,getallusermessages)

export default messageRouter