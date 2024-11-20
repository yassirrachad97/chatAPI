import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schemas';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let messageModel: Model<Message>;

  const mockMessageModel = {
    find: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: getModelToken('Message'),
          useValue: mockMessageModel,
        },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    messageModel = module.get<Model<Message>>(getModelToken('Message'));
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should handle socket connection', () => {
      const mockSocket = {
        on: jest.fn(),
        emit: jest.fn(),
      };

      gateway.server = {
        on: jest.fn((event, callback) => {
          if (event === 'connection') {
            callback(mockSocket);
          }
        }),
      } as any;

      gateway.onModuleInit();
      expect(gateway.server.on).toHaveBeenCalledWith(
        'connection',
        expect.any(Function),
      );
    });
  });

  // describe('handleMessage', () => {
  //   it('should save a message and emit roomMessage', async () => {
  //     const mockData = {
  //       sender: 'user1',
  //       receiver: 'user2',
  //       message: 'Hello',
  //     };

  //     const savedMessage = {
  //       _id: '123',
  //       ...mockData,
  //       roomName: 'user1-user2',
  //       createdAt: new Date(),
  //     };

  //     mockMessageModel.save = jest.fn().mockResolvedValue(savedMessage);
  //     mockMessageModel.findById = jest.fn().mockResolvedValue(savedMessage);

  //     gateway.server = {
  //       to: jest.fn().mockReturnThis(),
  //       emit: jest.fn(),
  //     } as any;

  //     await gateway.handleMessage(mockData);

  //     expect(mockMessageModel.save).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         message: 'Hello',
  //         sender: 'user1',
  //         receiver: 'user2',
  //         roomName: 'user1-user2',
  //       }),
  //     );

  //     expect(gateway.server.to).toHaveBeenCalledWith('user1-user2');
  //     expect(gateway.server.emit).toHaveBeenCalledWith('newMessageNotification', {
  //       message: 'You have a new message from user1 in room user1-user2',
  //       sender: 'user1',
  //     });
  //   });
  // });

  describe('getRoomMessages', () => {
    it('should fetch room messages and emit roomMessages', async () => {
      const mockRoomName = 'room1';
      const mockMessages = [
        { message: 'Hello', sender: 'user1', receiver: 'user2', roomName: mockRoomName },
      ];

      mockMessageModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMessages),
      });

      gateway.server = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      } as any;

      await gateway.getRoomMessages({ roomName: mockRoomName });

      expect(mockMessageModel.find).toHaveBeenCalledWith({ roomName: mockRoomName });
      expect(gateway.server.to).toHaveBeenCalledWith(mockRoomName);
      expect(gateway.server.emit).toHaveBeenCalledWith('roomMessages', mockMessages);
    });
  });
});
