import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RandomPick } from './randomPick.entity';

@Entity({ name: 'random_pick_results' })
export class RandomPickResult {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column()
  result: string;

  @OneToOne(() => RandomPick)
  @JoinColumn({ name: 'random_pick_id' })
  randomPick: RandomPick;

  get getRandomPickResultId(): number {
    return this.id;
  }
}
