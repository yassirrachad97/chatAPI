import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
})
export class ChatGateway implements OnModuleInit {
  client: any;
  private users = [];
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, string>();

  onModuleInit(): void {
    this.server.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.client = socket;

      socket.on('disconnect', () => {
        const username = this.onlineUsers.get(socket.id) || 'Unknown user';
        this.onlineUsers.delete(socket.id);
        this.server.emit('userDisconnected', { id: socket.id, username });
        console.log(`Client disconnected: ${socket.id} (${username})`);
      });
    });
  }

  @SubscribeMessage('setUsername')
  handleSetUsername(@MessageBody() data: { username: string }): void {
    if (!data?.username) {
      console.error(
        `Invalid data received in handleSetUsername: ${JSON.stringify(data)}`,
      );
      return;
    }

    // this.onlineUsers.set(this.client.id, data.username);
    this.users.push({ username: data.username, socketId: this.client.id });
    console.log(`Client ${this.client.id} set username: ${data.username}`);

    this.server.emit('userConnected', {
      id: this.client.id,
      username: data.username,
    });
    this.server.emit('onlineUsers', this.users);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { message: string }): void {
    if (!data?.message) {
      console.error('Message data is undefined or malformed');
      return;
    }

    console.log(
      `Received message: ${data.message} from client ID: ${this.client.id}`,
    );

    this.server.emit('message', {
      message: data.message,
      clientId: this.client.id,
    });
  }
}
