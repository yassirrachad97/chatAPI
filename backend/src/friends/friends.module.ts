import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersSchema } from "../users/schemas/users.schema";
import { FriendsService } from "./friends.service";
import { FriendsController } from "./friends.controller";
import { FriendsGateway } from "./Friends.gateway";


@Module({
    imports: [MongooseModule.forFeature([{ name : 'User', schema: UsersSchema}])],
    providers: [FriendsService, FriendsGateway ],
    controllers: [FriendsController],
})
export class FriendsModule {}