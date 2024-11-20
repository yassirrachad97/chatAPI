import { Schema, Document, Types } from 'mongoose';

export const MessageSchema = new Schema(
  {
    message: { type: String, required: true },
    sender: { type: Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Types.ObjectId, ref: 'User', required: true },
    roomName: { type: String, required: true }, 
  },
  {
    timestamps: true,
  },
);

// export interface Message extends Document {
//   message: string;
//   sender: Types.ObjectId;
//   receiver: Types.ObjectId;
//   roomName: string; 
// }


export interface Message extends Document {
  message: string;
  sender: Schema.Types.ObjectId | { username: string; image: string };
  receiver: Schema.Types.ObjectId | { username: string; image: string };
  roomName: string;
  createdAt: Date;
  // other fields as necessary
}
