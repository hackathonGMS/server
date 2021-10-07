import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Chat } from 'src/entities/chat/chat.entity';
import { Room } from 'src/entities/room/room.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ChatGateWay } from './chat.gateway';

@Controller('chat')
@ApiTags('picnic API')
export class ChatController {
  constructor(private readonly ChatGateWay: ChatGateWay) {}

  @Get('chatlist/:roomCode')
  @ApiOperation({
    summary: '방 번호를 통해서 채팅 내역을 불러옵니다.',
  })
  @ApiResponse({
    type: '방 번호, 채팅 내용, 시간, 보낸 사람 이름, 타입',
  })
  async getRoomData(@Param('roomCode') roomCode: string): Promise<Chat[]> {
    const room = await this.ChatGateWay.getRoom(roomCode);
    return this.ChatGateWay.getChatListWithRoomId(room.getRoomId);
  }
  @Get('getRoom/:roomCode')
  @ApiOperation({
    summary: '방 번호를 통해서 방 정보를 불러옵니다.',
  })
  @ApiResponse({
    type: '방 번호, 소속, 안건',
  })
  async getRoomInfo(@Param('roomCode') roomCode: string): Promise<Room> {
    return await this.ChatGateWay.getRoom(roomCode);
  }

  @Get('randompick/:roomCode')
  @ApiOperation({
    summary: '방 번호를 통해서 랜덤 뽑기 리스트, 제목, 결과를 불러옵니다.',
  })
  @ApiResponse({
    type: '',
  })
  async getRandomPick(@Param('roomCode') roomCode: string) {
    const room = await this.ChatGateWay.getRoom(roomCode);
    return this.ChatGateWay.getRandomPickWithRoomId(room.getRoomId);
  }
  @Get('user/:roomCode')
  @ApiOperation({
    summary: '반 번호를 통해서 방에 참여했던 사람들을 불러 옵니다.',
  })
  @ApiResponse({
    type: '',
  })
  async getUser(@Param('roomCode') roomCode: string) {
    const room = await this.ChatGateWay.getRoom(roomCode);
    return this.ChatGateWay.getUserWithRoomId(room.getRoomId);
  }
}
