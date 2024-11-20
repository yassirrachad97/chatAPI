// users.controller.ts
import { Controller, Post, Get, Param, Body, Put, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUserDto';  
import { User } from './interfaces/user.interface'; 

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);  
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();  
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);  
  }

  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: CreateUserDto
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);  
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);  
  }

  @Patch(':id/suspend')
  async suspendUser(@Param('id') id: string): Promise<User> {
    return this.usersService.suspendUser(id);  
  }

  @Patch(':id/unsuspend')
  async unsuspendUser(@Param('id') id: string): Promise<User> {
    return this.usersService.unsuspendUser(id);  
  }

  @Patch(':id/ban')
  async banUser(@Param('id') id: string): Promise<User> {
    return this.usersService.banUser(id);  
  }

  @Patch(':id/unban')
  async unbanUser(@Param('id') id: string): Promise<User> {
    return this.usersService.unbanUser(id);  
  }
}
