import { Controller, Post, Body, Param, Delete, Get } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { CreateFriendDto } from "./dto/create-friends.dto";
import { UpdateFriendStatusDto } from "./dto/update-friend-status.dto";



@Controller('friends')

export class FriendsController{
 constructor(private readonly friendService: FriendsService) {}  
 
 @Post('request')

 async sendRequest(@Body() createFriendDto: CreateFriendDto) {
   const result = await this.friendService.sendFriendRequest(createFriendDto);
   return result; 
 }

 

 @Post('accept/:requesterId/:recipientId')
 async acceptRequest(@Body() updateFriendStatusDto: UpdateFriendStatusDto) {
   return await this.friendService.acceptFriendRequest(updateFriendStatusDto);
 }


 @Post('reject/:requesterId/:recipientId')
 async rejectRequest(@Body() updateFriendStatusDto: UpdateFriendStatusDto) {
   return await this.friendService.rejectFriendRequest(updateFriendStatusDto);
 }




 @Delete(':requesterId/:recipientId')
 async deleteFriend(
   @Param('requesterId') requesterId: string,
   @Param('recipientId') recipientId: string,
 ): Promise<string> {
   const updateFriendStatusDto: UpdateFriendStatusDto = { requesterId, recipientId };
   return this.friendService.removefriend(updateFriendStatusDto);
 }

 @Get(':userId')
 async getFriends(@Param('userId') userId: string) {
   return await this.friendService.getFriends(userId);
 }
}