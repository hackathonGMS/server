import { Room } from 'src/entities/room/room.entity';

export class RoomInfoResponse {
  constructor(room: Room) {
    this.agenda = room.getRoomAgenda;
    this.group_name = room.getRoomGroupName;
  }
  group_name: string;
  agenda: string;
}
