// users.service.ts
import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private usersModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.usersModel(createUserDto);
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.usersModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.usersModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: CreateUserDto): Promise<User> {
    return this.usersModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User> {
    return this.usersModel.findByIdAndDelete(id).exec();
  }
}
