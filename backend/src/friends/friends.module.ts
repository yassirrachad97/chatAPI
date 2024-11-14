import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersSchema } from "../users/schemas/users.schema";
import { FriendsService } from "./friends.service";
import { FriendsController } from "./friends.controller";


@Module({
    imports: [MongooseModule.forFeature([{ name : 'User', schema: UsersSchema}])],
    providers: [FriendsService],
    controllers: [FriendsController],
})
export class FriendsModule {}