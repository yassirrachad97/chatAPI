import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChannelSchema } from './schemas/channel.schema';
import { DatabaseModule } from '../database/database.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    DatabaseModule,  
    MongooseModule.forFeature(
      [{ name: 'Channel', schema: ChannelSchema }],
    ),
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
