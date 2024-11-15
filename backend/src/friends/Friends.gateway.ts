import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { FriendsService } from "./friends.service";
import { Socket, Server } from "socket.io";


@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class FriendsGateway implements OnGatewayConnection, OnGatewayDisconnect{

    @WebSocketServer() server: Server;
    private activeUsers: Map<string, string> = new Map();
    constructor( private readonly friendService: FriendsService){}

    async handleConnection(client: Socket): Promise<void> {

        const userId = client.handshake.query.userId as string; 
        
        
        if(!userId){
            client.disconnect();
            return;
        }

        this.activeUsers.set(userId, client.id);

        await this.friendService.updateStatus(userId, 'online');
        const friends = await this.friendService.getFriends(userId);
        friends.forEach((friend) => {
          const friendSocketId = this.activeUsers.get(friend.friendId.toString());
          if (friendSocketId) {
            this.server.to(friendSocketId).emit('friendOnline', { userId });
          }
        });
        
    }

    async handleDisconnect(client: Socket): Promise<void> {
        const userId = Array.from(this.activeUsers.entries()).find(
          ([, socketId]) => socketId === client.id,
        )?.[0];

        if (userId) {
            this.activeUsers.delete(userId);
            await this.friendService.updateStatus(userId, 'offline');
            const friends = await this.friendService.getFriends(userId);
            friends.forEach((friend) => {
              const friendSocketId = this.activeUsers.get(friend.friendId.toString());
              if (friendSocketId) {
                this.server.to(friendSocketId).emit('friendOffline', { userId });
              }
            });
          }
        }

}