import { Room } from 'src/entities/room/room.entity';

export class CreateRoomResponseDto {
  constructor(room: Room) {
    this.agenda = room.getRoomAgenda;
    this.group_name = room.getRoomGroupName;
    this.room = room.getRoomCode;
  }
  room: string;
  group_name: string;
  agenda: string;
}
