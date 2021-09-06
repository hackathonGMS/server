import { IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  room: string;

  @IsString()
  group_name: string;

  @IsString()
  agenda: string;
}
