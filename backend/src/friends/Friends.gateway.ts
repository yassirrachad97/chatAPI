import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { FriendsService } from './friends.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
})
@Injectable()
export class FriendsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  id:string;

  private activeUsers: Map<string, string> = new Map();

  constructor(private readonly friendsService: FriendsService) {}

  onModuleInit(): void {
    this.server.on('connection', (socket: Socket) => {
      console.log(`Client connectefffrrr: ${socket.id}`);
  
      // Gestion de l'événement changeStatus
      socket.on('changeStatus', async (data: { id: string }) => {
        console.log(`Received changeStatus for user ID: ${data.id}`);
        this.id = data.id
  
        try {
        
          const userFriends = await this.friendsService.getUser(data.id);
          
          console.log(`Friends retrieved for user ${data.id}:`, userFriends);
  
        
          socket.emit('getUser', userFriends);
        } catch (error) {
          console.error(
            `Error retrieving friends for user ${data.id}:`,
            error.message,
          );
  
         
          socket.emit('error', { message: 'Failed to retrieve friends' });
        }
      });

      socket.on('changeStatusOfline', async (data: { id: string }) => {
        console.log(`Received changeStatus for user ID: ${data.id}`);
  
        try {
        
          const userFriends = await this.friendsService.getOfline(data.id);
          
          console.log(`Friends retrieved for user ${data.id}:`, userFriends);
  
        
          socket.emit('getUser', userFriends);
        } catch (error) {
          console.error(
            `Error retrieving friends for user ${data.id}:`,
            error.message,
          );
  
       
          socket.emit('error', { message: 'Failed to retrieve friends' });
        }
      });
  
      socket.on('disconnect', async () => {
        console.log(`Client disconnected: ${socket.id}`);
        try {
          
          const userFriends = await this.friendsService.getOfline(this.id);
          
          console.log(`Friends retrieved for user ${this.id}:`, userFriends);
  
        
          socket.emit('getUser', userFriends);
        } catch (error) {
          console.error(
            `Error retrieving friends for user ${this.id}:`,
            error.message,
          );
  
       
          socket.emit('error', { message: 'Failed to retrieve friends' });
        }
      });
    });
  }
  

  async handleConnection(client: Socket): Promise<void> {
    const userId = client.handshake.query.userId as string;

    if (userId) {
      this.activeUsers.set(userId, client.id);
      await this.friendsService.updateStatus(userId, 'online');

      const friends = await this.friendsService.getFriends(userId);
      friends.forEach((friend) => {
        const friendSocketId = this.activeUsers.get(friend.friendId.toString());
        if (friendSocketId) {
          this.server.to(friendSocketId).emit('friendOnline', { userId });
        }
      });

      console.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = [...this.activeUsers.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];

    if (userId) {
      this.activeUsers.delete(userId);
      await this.friendsService.updateStatus(userId, 'offline');

      const friends = await this.friendsService.getFriends(userId);
      friends.forEach((friend) => {
        const friendSocketId = this.activeUsers.get(friend.friendId.toString());
        if (friendSocketId) {
          this.server.to(friendSocketId).emit('friendOffline', { userId });
        }
      });

      console.log(`User ${userId} disconnected`);
    }
  }

  getOnlineUsers(): string[] {
    return Array.from(this.activeUsers.keys());
  }

  @SubscribeMessage('getFriendsStatus')
  async handleGetFriendsStatus(
    @MessageBody() userId: string,
    client: Socket,
  ): Promise<void> {
    try {
      const friends = await this.friendsService.getFriends(userId);

      const onlineFriends = friends.filter((friend) =>
        this.activeUsers.has(friend.friendId.toString()),
      );

      const offlineFriends = friends.filter(
        (friend) => !this.activeUsers.has(friend.friendId.toString()),
      );

      client.emit('friendsStatus', {
        online: onlineFriends,
        offline: offlineFriends,
      });
    } catch (error) {
      console.error(`Error fetching friends status for user ${userId}:`, error);
      client.emit('error', { message: 'Failed to fetch friends status' });
    }
  }
}
