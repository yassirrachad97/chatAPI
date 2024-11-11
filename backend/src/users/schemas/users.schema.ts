import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    image: { type: String },
    token: { type: String },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);
