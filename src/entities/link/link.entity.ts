import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../room/room.entity';

@Entity({ name: 'links' })
export class Link {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column()
  private name: string;

  @Column()
  private link: string;

  @ManyToOne(() => Room, (room) => room.getRoomId)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  get getLinkId(): number {
    return this.id;
  }
  get getLinkName(): string {
    return this.name;
  }
  get getLink(): string {
    return this.link;
  }
}
