import { Document } from 'mongoose';
import { ObjectId } from 'mongoose';

export interface Message extends Document {
  sender: ObjectId; 
  receiver: ObjectId; 
  message: string;
  createdAt: Date;
  readAt: Date | null; 
}
