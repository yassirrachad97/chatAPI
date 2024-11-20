import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get()
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(id, updateChannelDto); 
  }
  
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.channelService.remove(id);
    return { message: `Channel with ID "${id}" has been removed` };
  }

  @Post(':channelId/member/:userId')
  async addMember(
    @Param('channelId') channelId: string,
    @Param('userId') userId: string,
  ) {
    const updatedChannel = await this.channelService.addMember(channelId, userId);
    return updatedChannel;
  }

  @Delete(':channelId/member/:userId')
  async removeMember(
    @Param('channelId') channelId: string,
    @Param('userId') userId: string,
  ) {
    const updatedChannel = await this.channelService.removeMember(channelId, userId);
    return updatedChannel;
  }
}
