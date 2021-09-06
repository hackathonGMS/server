import { Body, Controller } from '@nestjs/common';
import { CreateRoomDto } from './dto/createRoom.dto';
import { CreateRoomResponseDto } from './dto/createRoomResponse.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomServise: RoomService) {}

  createRoom(@Body() dto: CreateRoomDto): Promise<CreateRoomResponseDto> {
    return this.roomServise.createRoom(dto);
  }
}
