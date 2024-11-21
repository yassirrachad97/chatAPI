import { IsString, IsEnum, IsOptional, IsArray, IsMongoId} from 'class-validator';
import { Types } from 'mongoose';

export class CreateChannelDto {
  @IsString()
  name: string;

  @IsEnum(['public', 'private'])
  type: 'public' | 'private';

  @IsArray()
  @IsOptional()
  members?: Types.ObjectId[]; 

  @IsMongoId()
  createdBy: Types.ObjectId;
}
