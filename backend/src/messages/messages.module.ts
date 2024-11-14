import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { messagesProviders } from './providers/messages.providers';
import { DatabaseModule } from 'src/database/database.module';
import { MessageSchema } from './schemas/message.schemas';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])
  ],
  controllers: [MessagesController],
  providers: [MessagesService, ChatGateway, ...messagesProviders],
  exports: [...messagesProviders],  
})
export class MessagesModule {}
