// app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat-v-youcode'),
    DatabaseModule,
<<<<<<< HEAD
    UsersModule,
    MessagesModule,
=======
    UsersModule,  
    MessagesModule, 
    FriendsModule, 
>>>>>>> 41a5054962f6db4d61ee0e0bf425009935933a88
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
