import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsOptional()
  @IsString()
  readonly image?: string;

  @IsOptional()
  @IsString()
  readonly token?: string;

  @IsEnum(['online', 'offline'])
  readonly status: 'online' | 'offline';
}
