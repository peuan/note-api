import { Base } from 'src/common/entities/base.entity';
import { User } from 'src/modules/auth/entities/user.entity';
import { Note } from 'src/modules/note/entities/note.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { NotificationType } from '../enums/notification.enum';
import { LikedNote } from '../interfaces/liked-note.interface';

@Entity()
export class Notification extends Base {
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  @Column()
  type: NotificationType;

  @Column()
  noteId: string;

  @Column({ type: 'bool', default: false })
  read: boolean;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'bool', default: true })
  active: boolean;

  note?: Note;

  likedNote(payload: LikedNote) {
    this.user = payload.user;
    this.fromUser = payload.fromUser;
    this.noteId = payload.noteId;
    this.title = payload.title;
    this.type = NotificationType.LIKED_NOTE;
  }

  dislike() {
    this.active = false;
  }
}
