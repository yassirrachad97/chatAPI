import { Document } from 'mongoose';

export interface User extends Document {
  username: string;
  image: string;
  token: string;
  status: 'online' | 'offline';
  friends: string[];
}
