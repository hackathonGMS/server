import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat/chat.entity';
import { RandomPick } from 'src/entities/random/randomPick.entity';
import { RandomPickList } from 'src/entities/random/randomPickList.entity';
import { RandomPickResult } from 'src/entities/random/randomPickResult.entity';
import { Room } from 'src/entities/room/room.entity';
import { User } from 'src/entities/user/users.entity';
import { ChatController } from './chat.controller';
import { ChatGateWay } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Room,
      Chat,
      RandomPick,
      RandomPickList,
      RandomPickResult,
      User,
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatGateWay],
})
export class ChatGatewayModule {}
