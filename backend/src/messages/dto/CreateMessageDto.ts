import { IsString, IsInt, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateMessageDto {
  @IsString()
  sender: ObjectId;

  @IsString()
  receiver: ObjectId;
  @IsString()
  message: string;

  @IsBoolean()
  isRead:boolean;
  @IsOptional()
  @IsInt()
  createdAt?: number;
}
