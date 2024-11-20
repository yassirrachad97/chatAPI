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

    // Ajouter un membre au canal privé
    async addMember(channelId: string, userId: string): Promise<Channel> {
      const channel = await this.channelModel.findById(channelId);
  
      if (!channel) {
        throw new NotFoundException(`Channel with ID "${channelId}" not found`);
      }
  
      if (channel.type !== 'private') {
        throw new Error('Only private channels can have members');
      }
  
      // Vérifie si l'utilisateur est déjà membre
      if (channel.members.includes(userId)) {
        throw new Error('User is already a member of this channel');
      }
  
      channel.members.push(userId);
      await channel.save();
      return channel;
    }
}
