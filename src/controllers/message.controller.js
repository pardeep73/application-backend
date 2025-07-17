import Message from "../models/message.model.js";


export const createMessage = async (req, res) => {
  try {
    const sender = req.id
    const receiver = req.params.id
    const { message } = req.body;



    if (!message || !sender || !receiver) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newMessage = new Message({
      message,
      sender,
      receiver,
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({
      success: true,
      data: savedMessage,
    });
  } catch (error) {
    console.error('Error creating message:', error.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};



export const getMessagesofSender = async (req, res) => {
  try {
    const senderId = req.id; // get sender ID from the URL

    if (!senderId) {
      return res.status(400).json({ error: 'Sender ID is required' });
    }

    const messages = await Message.find({ sender: senderId })

    if (!messages) {
      return res.status(400).json({ error: "messages not found" });
    }

    res.status(200).json({
      success: true,
      /* count: messages.length, */
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};



export const getMessagesofReceiver = async (req, res) => {
  try {
    const receiverId = req.params.id;


    if (!receiverId) {
      return res.status(400).json({ error: 'Receiver ID is required' });
    }

    const messages = await Message.find({ sender: receiverId })

    if (!messages) {
      return res.status(400).json({ error: "messages not found" });
    }

    res.status(200).json({
      success: true,
      /* count: messages.length, */
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};


export const getallusermessages = async (req, res) => {
  try {

    const senderId = req.id;
    const receiverId = req.params.id;


    if (!receiverId || !senderId) {
      return res.status(400).json({ error: 'users id are not recieved' });
    }

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ createdAt: 1 });


    if (!messages) {
      return res.status(400).json({ error: "messages not found" });
    }

    res.status(200).json({
      success: true,
      data: messages,
    });

  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
