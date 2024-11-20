import { IsString, IsNotEmpty } from "class-validator";


export class CreateFriendDto{
    @IsString()
    @IsNotEmpty()
    requesterId: string;

    @IsString()
    @IsNotEmpty()
    recipientId: string;
    
}