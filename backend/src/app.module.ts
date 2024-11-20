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
    UsersModule,
    MessagesModule,
<<<<<<< HEAD
=======
    FriendsModule,
>>>>>>> 43cd0d77f9d5af5c9a9296d433ce6cd9d4535294
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
