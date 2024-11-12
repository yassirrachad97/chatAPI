// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat-v-youcode'),
    DatabaseModule,
    UsersModule,  
    MessagesModule,  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

