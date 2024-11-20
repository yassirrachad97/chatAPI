import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateFriendStatusDto {
    @IsString()
    @IsNotEmpty()
    requesterId: string;

    @IsString()
    @IsNotEmpty()
    recipientId: string;
}
