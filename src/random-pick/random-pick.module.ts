import { Module } from '@nestjs/common';
import { RandomPickService } from './random-pick.service';
import { RandomPickController } from './random-pick.controller';

@Module({
  providers: [RandomPickService],
  controllers: [RandomPickController],
})
export class RandomPickModule {}
