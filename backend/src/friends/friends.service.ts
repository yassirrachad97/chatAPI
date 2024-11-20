import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, isValidObjectId } from "mongoose";
import { CreateFriendDto } from "./dto/create-friends.dto";
import { User, UserFriend } from '../users/interfaces/user.interface';
import { UpdateFriendStatusDto } from "./dto/update-friend-status.dto";


@Injectable()
export class FriendsService {

    constructor(@InjectModel('User') private userModel: Model<User>) {}

    // private convertToObjectId(id: string): Types.ObjectId {
    //     return new Types.ObjectId(id);
    // }

    async getUser(id: string) {
      console.log(`Fetching user with ID: ${id}`);
      
      
      const user = await this.userModel.findById(id);
      
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
    
     
      user.status = "online";
      await user.save();
    
      return user;
    }

    async getOfline(id: string) {
      console.log(`Fetching user with ID: ${id}`);
      
      
      const user = await this.userModel.findById(id);
      
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
    
   
      user.status = "offline";
      await user.save();
    
      return user;
    }
    

    async checkExistingFriendRequest(createFriendDto: CreateFriendDto): Promise<boolean> {
      const { requesterId, recipientId } = createFriendDto;
      const requester = await this.userModel.findById(requesterId);
      const recipient = await this.userModel.findById(recipientId);

      return (
          requester.friends.some(
              (friend) => friend.friendId.toString() === recipientId && friend.status === 'pending',
          ) || recipient.friends.some(
              (friend) => friend.friendId.toString() === requesterId && friend.status === 'pending',
          )
      );
  }
   
  async sendFriendRequest(createFriendDto: CreateFriendDto): Promise<string> {
    const { requesterId, recipientId } = createFriendDto;

    const exists = await this.checkExistingFriendRequest(createFriendDto);
    if (exists) {
        throw new HttpException('Friend request already exists', HttpStatus.BAD_REQUEST);
    }

    const requester = await this.userModel.findById(requesterId);
    const recipient = await this.userModel.findById(recipientId);

    requester.friends.push({ friendId: new Types.ObjectId(recipientId), status: 'pending' });
    recipient.friends.push({ friendId: new Types.ObjectId(requesterId), status: 'pending' });

    await requester.save();
    await recipient.save();
    return 'Friend request sent successfully';
}
async acceptFriendRequest(updateFriendStatusDto: UpdateFriendStatusDto): Promise<string> {
  const { requesterId, recipientId } = updateFriendStatusDto;
  const requester = await this.userModel.findById(requesterId);
  const recipient = await this.userModel.findById(recipientId);

  const requesterFriend = requester.friends.find(
      (friend) => friend.friendId.toString() === recipientId && friend.status === 'pending',
  );
  const recipientFriend = recipient.friends.find(
      (friend) => friend.friendId.toString() === requesterId && friend.status === 'pending',
  );

  if (requesterFriend) requesterFriend.status = 'accepted';
  if (recipientFriend) recipientFriend.status = 'accepted';

  await requester.save();
  await recipient.save();

  return 'Friend request accepted successfully';
}


async rejectFriendRequest(updateFriendStatusDto: UpdateFriendStatusDto): Promise<string> {
  const { requesterId, recipientId } = updateFriendStatusDto;
  const requester = await this.userModel.findById(requesterId);
  const recipient = await this.userModel.findById(recipientId);

  const requesterFriend = requester.friends.find(
      (friend) => friend.friendId.toString() === recipientId && friend.status === 'pending',
  );
  const recipientFriend = recipient.friends.find(
      (friend) => friend.friendId.toString() === requesterId && friend.status === 'pending',
  );

  if (requesterFriend) requesterFriend.status = 'rejected';
  if (recipientFriend) recipientFriend.status = 'rejected';

  await requester.save();
  await recipient.save();
  return 'Friend request rejected';
}

async removefriend(updateFriendStatusDto: UpdateFriendStatusDto): Promise<string> {
    const { requesterId, recipientId } = updateFriendStatusDto;
    console.log(requesterId, recipientId);
  
    if (!isValidObjectId(requesterId) || !isValidObjectId(recipientId)) {
      throw new HttpException('Invalid ObjectId format', HttpStatus.BAD_REQUEST);
    }
  
    const requester = await this.userModel.findById(requesterId);
    const recipient = await this.userModel.findById(recipientId);
  
    if (!requester || !recipient) {
      throw new HttpException('One or both users not found', HttpStatus.NOT_FOUND);
    }

    const isRequesterFriend = requester.friends.some(
      (friend) => friend.friendId.toString() === recipientId,
    );
    const isRecipientFriend = recipient.friends.some(
      (friend) => friend.friendId.toString() === requesterId,
    );


    if (!isRequesterFriend || !isRecipientFriend) {
      return 'Friend relationship does not exist';
    }
  
    requester.friends = requester.friends.filter(
      (friend) => friend.friendId.toString() !== recipientId,
    );
  
    recipient.friends = recipient.friends.filter(
      (friend) => friend.friendId.toString() !== requesterId,
    );
  
    await requester.save();
    await recipient.save();
  
    return 'Friend removed successfully';
  }
  async getFriends(userId: string): Promise<UserFriend[]> {
    const user = await this.userModel
        .findById(userId)
        .populate('friends.friendId', 'username status image');

    if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    console.log(user);
    

    return user.friends; 
}


  

async updateStatus(userId: string, status: 'online' | 'offline'): Promise<void> {
  await this.userModel.findByIdAndUpdate(userId, { status });
}

}
