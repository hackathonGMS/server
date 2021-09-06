import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { Chat } from 'src/entities/chat/chat.entity';
import { Repository } from 'typeorm';
import { ChatDto } from './dto/chatInfo.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
  ) {}

  private logger = new Logger('ChatGatewayService');

  private chatDtoToEntity(dto: ChatDto): Chat {
    const chat = new Chat();
    chat.setChatContent = dto.content;
    chat.setChatName = dto.name;
    chat.setChatTime = dto.time;
    return chat;
  }
  async saveChat(dto: ChatDto): Promise<BasicMessageDto> {
    try {
      await this.chatRepository.save(this.chatDtoToEntity(dto));
      this.logger.log('save chat!');
      return new BasicMessageDto('save chat!');
    } catch (e) {
      console.log(e);
    }
  }
}
