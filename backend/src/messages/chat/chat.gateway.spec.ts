import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let mockMessageModel: jest.Mocked<Model<any>>;
  let mockServer: any;

  beforeEach(async () => {
    mockMessageModel = {
      create: jest.fn(),
      findById: jest.fn(),
    } as any;

    mockServer = {
      to: jest.fn(() => ({
        emit: jest.fn(),
      })),
      emit: jest.fn(),
    };

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
    gateway.server = mockServer;
  });

  it('should handle message and emit events', async () => {
    const data = {
      sender: 'user1',
      receiver: 'user2',
      message: 'Hello, World!',
    };

    const mockSavedMessage:any = {
      _id: 'messageId',
      message: data.message,
      sender: { username: 'user1', image: 'user1.jpg' },
      receiver: { username: 'user2', image: 'user2.jpg' },
    };

    mockMessageModel.create.mockResolvedValue(mockSavedMessage);
    mockMessageModel.findById.mockResolvedValue(mockSavedMessage);

    await gateway.handleMessage(data);

    const roomName = 'user1-user2';

    // Verify the message was saved
    expect(mockMessageModel.create).toHaveBeenCalledWith({
      message: data.message,
      sender: data.sender,
      receiver: data.receiver,
      roomName,
    });

    // Verify room messages were emitted
    expect(mockServer.to).toHaveBeenCalledWith(roomName);
    expect(mockServer.to(roomName).emit).toHaveBeenCalledWith('roomMessage', {
      message: mockSavedMessage,
      sender: data.sender,
    });

    // Verify notification was emitted
    expect(mockServer.emit).toHaveBeenCalledWith('newMessageNotification', {
      message: `You have a new message from ${data.sender} in room ${roomName}`,
      sender: data.sender,
    });
  });
});
