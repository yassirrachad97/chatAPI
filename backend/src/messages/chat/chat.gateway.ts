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
import { UsersService } from 'src/users/users.service';

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
  @WebSocketServer()
  server: Server;
  socket: any;

  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

  onModuleInit(): void {
    this.server.on('connection', (socket: Socket) => {
      this.socket = socket;

      socket.on('createRoom', (name: string) => {
        socket.join('roomName');
        this.server.to('roomName').emit('join', `Ajoute users ${name}`);
      });

      socket.on('handelMessage', (data: { message: string }) => {
        this.server.to('roomName').emit('getts', data.message);
      });

      socket.on('joinRoom', async ({ roomName }) => {
        if (roomName) {
          socket.join(roomName);
          socket.emit('joinRoomNotification', `Welcome to room: ${roomName}`);

          this.server.to(roomName).emit('userJoinedNotification', {
            message: `A new user has joined the room: ${roomName}`,
            userId: socket.id,
          });

          const messages = await this.messageModel
            .find({ roomName })
            .sort({ createdAt: 1 })
            .populate({
              path: 'sender',
              select: ['username', 'image'],
            })
            .populate({
              path: 'receiver',
              select: ['username', 'image'],
            });

          socket.emit('roomMessages', messages);
        } else {
          console.error('Room name is required');
        }
      });

      socket.on('start-typing', async ({ data }) => {
        console.log('Start typing:', data);

        if (data && data.roomName) {
          socket.to(data.roomName).emit('getTyping', {
            id: data.id,
            typing: true,
          });
        } else {
          console.error('Room name is missing for start-typing event');
        }
      });

      socket.on('stop-typing', async ({ data }) => {
        console.log('Stop typing:', data);

        if (data && data.roomName) {
          socket.to(data.roomName).emit('getTyping', {
            id: data.id,
            typing: false,
          });
        } else {
          console.error('Room name is missing for stop-typing event');
        }
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    data: {
      sender: string;
      receiver: string;
      message: string;
    },
  ): Promise<void> {
    if (!data?.message || !data.sender || !data.receiver) {
      console.error('Message data is incomplete');
      return;
    }

    const participants = [data.sender, data.receiver].sort();
    const roomName = `${participants[0]}-${participants[1]}`;

    const newMessage = new this.messageModel({
      message: data.message,
      sender: data.sender,
      receiver: data.receiver,
      roomName: roomName,
    });
    await newMessage.save();

    const populatedMessage = await this.messageModel
      .findById(newMessage._id)
      .populate({
        path: 'sender',
        select: ['username', 'image'],
      })
      .populate({
        path: 'receiver',
        select: ['username', 'image'],
      });

    this.server.to(roomName).emit('roomMessage', {
      message: populatedMessage,
      sender: data.sender,
    });

    this.server.to(data.receiver).emit('getConvirsation', {
      message: 'getConvirsation  = ' + newMessage.message,
    });

    this.server.emit('newMessageNotification', {
      message: `You have a new message from ${data.sender} in room ${roomName}`,
      sender: data.sender,
    });
  }

  @SubscribeMessage('getRoomMessages')
  async getRoomMessages(
    @MessageBody() data: { roomName: string },
  ): Promise<void> {
    if (!data.roomName) {
      console.error('Room name is missing');
      return;
    }

    const messages = await this.messageModel
      .find({ roomName: data.roomName })
      .sort({ createdAt: 1 });

    this.server.to(data.roomName).emit('roomMessages', messages);
  }

  @SubscribeMessage('getContacts')
  async getListContactMessages(
    @MessageBody() data: { roomName: string },
  ): Promise<void> {
    this.socket.join(data.roomName);

    this.server.emit(
      'joinRoomNotification',
      `Welcome to room: ${data.roomName}`,
    );

    this.server.to(data.roomName).emit('userJoinedNotification', {
      message: `A new user has joined the room: ${data.roomName}`,
      userId: this.socket.id,
    });

    const userId = data.roomName;
    const messages = await this.messageModel
      .find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
      .populate('sender', 'username image _id')
      .populate('receiver', 'username image _id')
      .sort({ createdAt: -1 })
      .exec();

    const contacts: { [key: string]: any } = {};

    messages.forEach((message) => {
      const sender = message.sender;
      const receiver = message.receiver;

      if (
        sender &&
        typeof sender === 'object' &&
        '_id' in sender &&
        'username' in sender &&
        'image' in sender &&
        receiver &&
        typeof receiver === 'object' &&
        '_id' in receiver &&
        'username' in receiver &&
        'image' in receiver
      ) {
        const contactId =
          sender._id.toString() === userId
            ? receiver._id.toString()
            : sender._id.toString();

        if (
          !contacts[contactId] ||
          message.createdAt > contacts[contactId].lastMessageDate
        ) {
          contacts[contactId] = {
            _id:
              sender._id.toString() === userId
                ? receiver._id.toString()
                : sender._id.toString(),
            username:
              sender._id.toString() === userId
                ? receiver.username
                : sender.username,
            image:
              sender._id.toString() === userId ? receiver.image : sender.image,
            roomName: message.roomName,
            lastMessage: message.message,
            lastMessageDate: message.createdAt,
          };
        }
      } else {
        console.error('Data missing in sender or receiver:', sender, receiver);
      }
    });

    this.server.to(data.roomName).emit('contacts', Object.values(contacts));
  }
}
