import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from '../chat/chat.entity';
import { User } from '../user/users.entity';

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({ nullable: false })
  private room: string;

  @Column({ nullable: true })
  private group_name: string;

  @Column({ nullable: true })
  private agenda: string;

  @OneToMany(() => User, (user) => user.room)
  users: User[];

  @OneToMany(() => Chat, (chat) => chat.room)
  chats: Chat[];

  get getRoomId(): number {
    return this.id;
  }
  get getRoomCode(): string {
    return this.room;
  }
  get getRoomGroupName(): string {
    return this.group_name;
  }
  get getRoomAgenda(): string {
    return this.agenda;
  }

  set setRoomCode(roomCode: string) {
    this.room = roomCode;
  }
  set setRoomGroupName(group: string) {
    this.group_name = group;
  }
  set setRoomAgenda(agenda: string) {
    this.agenda = agenda;
  }
}
