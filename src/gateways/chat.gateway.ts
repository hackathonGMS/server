import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatDto } from 'src/chat/dto/chatInfo.dto';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { Chat } from 'src/entities/chat/chat.entity';
import { RandomPick } from 'src/entities/random/randomPick.entity';
import { RandomPickList } from 'src/entities/random/randomPickList.entity';
import { RandomPickResult } from 'src/entities/random/randomPickResult.entity';
import { Room } from 'src/entities/room/room.entity';
import { User } from 'src/entities/user/users.entity';
import { CreateRoomDto } from 'src/room/dto/createRoom.dto';
import { CreateRoomResponseDto } from 'src/room/dto/createRoomResponse.dto';
import { RoomInfoResponse } from 'src/room/dto/room-info.dto';
import { Repository } from 'typeorm';

interface RoomInfo {
  room: string;
}
interface ChatData {
  msg: string;
  name: string;
  time: string;
  room: string;
}

enum SocketDataType {
  MSG = 'message',
  ALERT_JOIN = 'alert_join_room',
  LINK = 'link',
  TTS = 'tts',
  IMPORTANT = 'important',
}

@Injectable()
@WebSocketGateway(3012, { namespace: 'chat' })
export class ChatGateWay
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(RandomPick)
    private readonly randomPickRepository: Repository<RandomPick>,

    @InjectRepository(RandomPickList)
    private readonly randomPickListRepository: Repository<RandomPickList>,

    @InjectRepository(RandomPickResult)
    private readonly randomPickResultRepository: Repository<RandomPickResult>,
  ) {}

  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  peers: Socket[] = [];

  private rooms: string[] = [];

  async getChatListWithRoomId(roomId: number): Promise<Chat[]> {
    return await this.chatRepository.find({ where: { room: roomId } });
  }

  private async chatDtoToEntity(dto: ChatDto): Promise<Chat> {
    const chat = new Chat();

    chat.setChatContent = dto.content;
    chat.setChatName = dto.name;
    chat.setChatTime = dto.time;
    chat.setChatType = dto.type;

    const room = await this.getRoom(dto.room);
    chat.room = room;

    return chat;
  }
  private roomCreateDtoToEntity(dto: CreateRoomDto): Room {
    const room = new Room();
    room.setRoomAgenda = dto.agenda;
    room.setRoomCode = dto.room;
    room.setRoomGroupName = dto.group_name;
    return room;
  }
  private async randomPickCreateDtoToEntity(
    title: string,
    roomCode: string,
  ): Promise<RandomPick> {
    const random = new RandomPick();

    random.setRandomPickTitle = title;
    random.room = await this.getRoom(roomCode);

    return random;
  }
  private async randomPickListCreateDtoToEntity(
    random: RandomPick,
    list: string[],
  ): Promise<boolean> {
    try {
      for (let i = 0; i < list.length; i++) {
        const randomListItem = new RandomPickList();

        randomListItem.randomPick = random;
        randomListItem.setRandomPickListItem = list[i];

        await this.randomPickListRepository.save(randomListItem);
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  private async randomPiskResultDtoToEntity(
    random: RandomPick,
    result: string,
  ): Promise<RandomPickResult> {
    try {
      const randomPickResult = new RandomPickResult();

      randomPickResult.result = result;
      randomPickResult.randomPick = random;

      return randomPickResult;
    } catch (e) {
      console.log(e);
    }
  }
  async saveChat(dto: ChatDto): Promise<BasicMessageDto> {
    try {
      await this.chatRepository.save(await this.chatDtoToEntity(dto));
      this.logger.log('save chat!');
      return new BasicMessageDto('save chat!');
    } catch (e) {
      console.log(e);
    }
  }

  async createRoomService(dto: CreateRoomDto): Promise<CreateRoomResponseDto> {
    try {
      const room = await this.roomRepository.save(
        this.roomCreateDtoToEntity(dto),
      );
      return new CreateRoomResponseDto(room);
    } catch (e) {
      console.log(e);
    }
  }
  async joinRoomService(name: string, roomCode: string): Promise<User> {
    try {
      const user = new User();
      const room = await this.getRoom(roomCode);

      user.room = room;
      user.setUserName = name;

      await this.userRepository.save(user);
      return user;
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

  async saveRandomPick(
    randomPickList: string[],
    title: string,
    roomCode: string,
    result: string,
  ): Promise<BasicMessageDto> {
    try {
      const random = await this.randomPickCreateDtoToEntity(title, roomCode);
      this.randomPickRepository.save(random);
      if (this.randomPickListCreateDtoToEntity(random, randomPickList)) {
        const randomPickResult = await this.randomPiskResultDtoToEntity(
          random,
          result,
        );
        await this.randomPickResultRepository.save(randomPickResult);
        return new BasicMessageDto('save!');
      } else {
        return new BasicMessageDto('fail');
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getRandomPickWithRoomId(roomId: number): Promise<any[]> {
    try {
      const result: any[] = [];
      const randomPick = await this.randomPickRepository.find({
        where: {
          room: roomId,
        },
      });
      for (let i = 0; i < randomPick.length; i++) {
        const randomPickList = await this.randomPickListRepository.find({
          where: {
            randomPick: randomPick[i].getRandomPickId,
          },
        });
        const randomPickResult = await this.randomPickResultRepository.find({
          where: {
            randomPick: randomPick[i].getRandomPickId,
          },
        });
        const randomPickData = {
          title: randomPick[i].getRandomPickTitle,
          list: randomPickList,
          result: randomPickResult,
        };
        result.push(randomPickData);
      }
      return result;
    } catch (e) {}
  }

  async getUserWithRoomId(roomId: number): Promise<User[]> {
    try {
      return this.userRepository.find({ where: { room: roomId } });
    } catch (e) {}
  }

  private isUsedRoomCode(room: string): boolean {
    if (this.rooms.includes(room)) return true;
    else return false;
  }

  private makeRoomCode() {
    const chars = '0123456789';
    const stringLength = 6;
    let randomstring = '';

    while (1) {
      for (let i = 0; i < stringLength; i++) {
        const rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
      }
      if (!this.isUsedRoomCode(randomstring)) break;
    }

    return randomstring;
  }

  private randomNumber(indexSize: number) {
    const result: number = Math.floor(Math.random() * indexSize);
    return result;
  }

  @SubscribeMessage('emoticonExpression')
  async getExpression(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const [expr, id, room] = data;
    client.join(room);
    client.to(room).emit('getEmoticonExpression', { expr, id });
  }

  @SubscribeMessage('sendMessage')
  async sendChat(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const [type, msg, room, name, time] = data;

    const chat: ChatDto = {
      content: msg,
      name,
      room,
      time,
      type,
    };
    console.log(type, chat);
    console.log(await this.saveChat(chat));

    client.to(room).emit('receiveMessage', {
      content: msg,
      name,
      type: SocketDataType.MSG,
      time,
    });
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const [group, agenda, name] = data;

    const code = this.makeRoomCode();

    const newRoom: CreateRoomDto = {
      room: code,
      group_name: group,
      agenda: agenda,
    };

    this.rooms.push(code);
    client.join(code);

    console.log(code, name, newRoom);

    client.emit('roomCode', code);
    client.to(code).emit('joinRoom', name);

    console.log(this.createRoomService(newRoom));
    console.log(this.joinRoomService(name, code));
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const [room, name] = data;
    const alert = {
      name: name,
      type: SocketDataType.ALERT_JOIN,
      content: '',
    };
    const roomInfo = await this.getRoomInfo(room);
    client.to(room).emit('joinRoom', alert);
    client.emit('roomInfo', roomInfo);
    client.join(room);
    console.log(this.joinRoomService(name, room));
  }

  @SubscribeMessage('randomPick')
  async randomPick(@MessageBody() data: any) {
    const [title, list, room] = data;
    const result = list[this.randomNumber(list.length)];
    await this.saveRandomPick(list, title, room, result);
    this.server.to(room).emit('randomPickList', list);
    this.server.to(room).emit('randomPickResult', result);
  }
  afterInit() {
    this.logger.log('INIT');
  }

  handleConnection(client: Socket) {
    this.logger.log('HIHI', client.id);
  }

  handleDisconnect(client: Socket) {
    this.peers = this.peers.filter((peer) => peer.id !== client.id);
    this.logger.log('BYEBYE');
  }
}
