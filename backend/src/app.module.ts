// app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ChannelModule } from './channel/channel.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendsModule } from './friends/friends.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat-v-youcode'),
    DatabaseModule,
    UsersModule,
    MessagesModule,
    FriendsModule,
    , ChannelModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
