import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { LinkModule } from './link/link.module';
import { RandomPickModule } from './random-pick/random-pick.module';
import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGatewayModule } from './gateways/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    RoomModule,
    LinkModule,
    RandomPickModule,
    ChatModule,
    ChatGatewayModule,
  ],
})
export class AppModule {}
