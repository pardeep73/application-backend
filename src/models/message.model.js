import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true, // message text is mandatory
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId, // refers to a user
      ref: 'User', // assumes there's a 'User' model
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
