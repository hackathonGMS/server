import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../room/room.entity';
import { RandomPickList } from './randomPickList.entity';
import { RandomPickResult } from './randomPickResult.entity';

@Entity({ name: 'random_pick' })
export class RandomPick {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column()
  private title: string;

  @OneToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @OneToMany(
    () => RandomPickList,
    (randomPickList) => randomPickList.randomPick,
  )
  list: RandomPickList[];

  get getRandomPickId(): number {
    return this.id;
  }
  get getRandomPickTitle(): string {
    return this.title;
  }

  set setRandomPickTitle(title: string) {
    this.title = title;
  }
}
