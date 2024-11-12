import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateMessageDto {
  @IsString()
  sender: ObjectId;

  @IsString()
  receiver: ObjectId;
  @IsString()
  message: string;

  @IsOptional()
  @IsInt()
  createdAt?: number;
}
