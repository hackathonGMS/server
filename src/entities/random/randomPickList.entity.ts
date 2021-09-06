import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RandomPick } from './randomPick.entity';

@Entity({ name: 'random_pick_lists' })
export class RandomPickList {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column()
  private item: string;

  @ManyToOne(() => RandomPick, (random) => random.getRandomPickId)
  @JoinColumn({ name: 'random_pick_id' })
  randomPick: RandomPick;

  get getRandomPickListId(): number {
    return this.id;
  }
  get getRandomPickListItem(): string {
    return this.item;
  }

  set setRandomPickListItem(item: string) {
    this.item = item;
  }
}
