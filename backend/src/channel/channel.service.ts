import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel } from './interfaces/channel.interface';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelService {
  constructor(@InjectModel('Channel') private channelModel: Model<Channel>) {}

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    const newChannel = new this.channelModel(createChannelDto);
    return newChannel.save(); 
  }

  findAll() {
    return `This action returns all channel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }


  async update(id: string, updateChannelDto: UpdateChannelDto): Promise<Channel> {
    const updatedChannel = await this.channelModel
      .findByIdAndUpdate(id, updateChannelDto, { new: true }) 
      .exec();

    if (!updatedChannel) {
      throw new NotFoundException(`Channel with ID "${id}" not found`);
    }

    return updatedChannel;
  }
  async remove(id: string): Promise<void> {
    const deletedChannel = await this.channelModel.findByIdAndDelete(id).exec();

    if (!deletedChannel) {
      throw new NotFoundException(`Channel with ID "${id}" not found`);
    }
  }
}
