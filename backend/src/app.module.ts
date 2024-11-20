import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { DatabaseModule } from './database/database.module';
// import { UsersModule } from './users/users.module';
// import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://zakariaelkoh10:bwEKNW8yU6AhTYpi@cluster0.iofaj.mongodb.net/AlloMedia',
    ),
    // DatabaseModule,
    // UsersModule,
    // MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
