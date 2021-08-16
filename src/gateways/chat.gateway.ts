import { Logger } from '@nestjs/common';
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

interface RoomInfo {
  group: string;
  roomCode: string;
  agenda: string;
}

enum SocketDataType {
  MSG = 'message',
  ALERT_JOIN = 'alert_join_room',
}

@WebSocketGateway(80, { namespace: 'chat' })
export class ChatGateWay
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;
  private logger = new Logger('ChatGateway');
  peers: Socket[] = [];

  private rooms: RoomInfo[] = [];

  private checkRoomCode(code: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomCode === code) return false;
    }
    return true;
  }

  private getRoomInfoWithRoomoCode(code: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomCode === code) return this.rooms[i];
    }
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
      if (this.checkRoomCode(randomstring)) break;
    }

    return randomstring;
  }

  private randomNumber(indexSize: number) {
    const result: number = Math.floor(Math.random() * indexSize);
    return result;
  }

  @SubscribeMessage('sendMessage')
  sendChat(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const [msg, room, name] = data;
    this.logger.log(data);

    client.to(room).emit('receiveMessage', {
      type: SocketDataType.MSG,
      name: name,
      content: msg,
      date: new Date(),
    });
  }

  @SubscribeMessage('roomInfo')
  getRoomInfo(@MessageBody() code: string, @ConnectedSocket() client: Socket) {
    client.emit('roomInfo', this.getRoomInfoWithRoomoCode(code));
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const [group, agenda, name] = data;
    const code = this.makeRoomCode();
    const newRoom: RoomInfo = {
      roomCode: code,
      group: group,
      agenda: agenda,
    };
    this.rooms.push(newRoom);
    client.join(code);
    console.log(code, name, newRoom);
    client.emit('roomCode', code);
    client.to(code).emit('joinRoom', name);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const [room, name] = data;
    console.log(room, name);
    const alert = {
      name: name,
      type: SocketDataType.ALERT_JOIN,
      conetent: '',
      date: new Date(),
    };
    client.to(room).emit('joinRoom', alert);
    client.emit('roomInfo', this.getRoomInfoWithRoomoCode(room));
    client.join(room);
  }

  @SubscribeMessage('randomPick')
  randomPick(@MessageBody() data: any) {
    const [list, room] = data;
    console.log(data);
    const result = list[this.randomNumber(list.length)];
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
