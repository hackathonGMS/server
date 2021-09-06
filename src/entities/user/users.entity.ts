import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../room/room.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column()
  private name: string;

  @ManyToOne(() => Room, (room) => room.getRoomId)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  get getUserId(): number {
    return this.id;
  }
  get getUserName(): string {
    return this.name;
  }

  set setUserName(name: string) {
    this.name = name;
  }
}
