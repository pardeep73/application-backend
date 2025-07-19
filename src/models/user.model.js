import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // name must be provided
    },
    email: {
      type: String,
      required: true,
      unique: true, // email must be different for each user
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Image'
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const User = mongoose.model('User', userSchema);

export default User;
