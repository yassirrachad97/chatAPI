import { Document, Types } from 'mongoose';


export interface UserFriend {
  friendId: Types.ObjectId; 
  status: 'pending' | 'accepted' | 'rejected';
}
export interface User extends Document {
  username: string;
  image: string;
  token: string;
  status: 'online' | 'offline';
  friends: UserFriend[];
}
