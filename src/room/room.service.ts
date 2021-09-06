import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/room/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/createRoom.dto';
import { CreateRoomResponseDto } from './dto/createRoomResponse.dto';
import { RoomInfoResponse } from './dto/room-info.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  private roomCreateDtoToEntity(dto: CreateRoomDto): Room {
    const room = new Room();
    room.setRoomAgenda = dto.agenda;
    room.setRoomCode = dto.room;
    room.setRoomGroupName = dto.group_name;
    return room;
  }
  async getRoom(roomCode: string): Promise<Room> {
    try {
      const room = await this.roomRepository.findOne({
        where: {
          room: roomCode,
        },
      });
      return room;
    } catch (e) {
      console.log(e);
    }
  }
  async getRoomId(roomCode: string): Promise<number> {
    try {
      const room = await this.roomRepository.findOne({
        where: {
          room: roomCode,
        },
      });
      return room.getRoomId;
    } catch (e) {
      console.log(e);
    }
  }
  async createRoom(dto: CreateRoomDto): Promise<CreateRoomResponseDto> {
    try {
      const room = await this.roomRepository.save(
        this.roomCreateDtoToEntity(dto),
      );
      return new CreateRoomResponseDto(room);
    } catch (e) {
      console.log(e);
    }
  }

  async getRoomInfo(roomCode: string): Promise<RoomInfoResponse> {
    try {
      const room = await this.roomRepository.findOne({
        where: {
          room: roomCode,
        },
      });
      if (!!room) {
        return new RoomInfoResponse(room);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
