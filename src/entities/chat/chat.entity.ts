import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../room/room.entity';

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column()
  private content: string;

  @Column()
  private time: string;

  @Column()
  private name: string;

  @ManyToOne(() => Room, (room) => room.getRoomId)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column()
  type: string;

  get getChatId(): number {
    return this.id;
  }
  get getChatName(): string {
    return this.name;
  }
  get getChatContent(): string {
    return this.content;
  }
  get getChatTime(): string {
    return this.time;
  }
  get getChatType(): string {
    return this.type;
  }

  set setChatName(name: string) {
    this.name = name;
  }
  set setChatContent(content: string) {
    this.content = content;
  }
  set setChatTime(time: string) {
    this.time = time;
  }
  set setChatType(type: string) {
    this.type = type;
  }
}
