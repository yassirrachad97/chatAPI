import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ChannelModule } from './channel/channel.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/chat-v-youcode'),DatabaseModule, UsersModule, ChannelModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
