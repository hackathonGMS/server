import { Module } from '@nestjs/common';
import { ChatGateWay } from './gateways/chat.gateway';

@Module({
  providers: [ChatGateWay],
})
export class AppModule {}
