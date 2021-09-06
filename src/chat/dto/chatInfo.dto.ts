import { IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  content: string;

  @IsString()
  time: string;

  @IsString()
  name: string;

  @IsString()
  room: string;

  @IsString()
  type: string;
}
