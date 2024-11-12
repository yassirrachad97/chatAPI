import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './interfaces/message.interfaces';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

  async addMessage(
    sender: string,
    receiver: string,
    message: string,
  ): Promise<Message> {
    const newMessage = new this.messageModel({
      sender,
      receiver,
      message,
    });

    return newMessage.save();
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messageModel
      .find()
      .populate('sender')
      .populate('receiver')
      .exec();
  }
}
