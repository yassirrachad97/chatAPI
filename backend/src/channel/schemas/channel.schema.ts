import * as mongoose from 'mongoose';

export const ChannelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, 
    type: {
      type: String,
      enum: ['public', 'private'],
      required: true,
      default: 'public', 
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User schema
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }, 
);
