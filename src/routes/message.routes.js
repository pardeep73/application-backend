import express from "express";
import { createMessage, getMessagesofReceiver, getMessagesofSender } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const messageRouter = express.Router();

messageRouter.route('/message',isAuthenticated,createMessage)
messageRouter.route('/sender',isAuthenticated,getMessagesofSender)
messageRouter.route('/receiver',isAuthenticated,getMessagesofReceiver)

export default messageRouter