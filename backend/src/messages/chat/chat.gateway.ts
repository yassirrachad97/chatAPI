import { OnModuleInit, Injectable } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schemas';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
})
@Injectable()
export class ChatGateway implements OnModuleInit {
  counter: number = 0;
  @WebSocketServer()
  server: Server;

  // Track connected clients
  private clients: Map<string, Socket> = new Map();

  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

  onModuleInit(): void {
    this.server.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.clients.set(socket.id, socket);

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.clients.delete(socket.id);
      });
    });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { sender: object; receiver: object; message: string },
    socket: Socket,
  ): Promise<void> {
    if (!data?.message) {
      console.error('Message data is undefined or malformed');
      return;
    }

    const newMessage = new this.messageModel({
      message: data.message,
      sender: data.sender,
      receiver: data.receiver,
    });

    await newMessage.save();

    this.counter += 1;
    console.log(newMessage);
    console.log(this.counter);

    this.server.emit('message', {
      message: newMessage,
    });
  }
}
