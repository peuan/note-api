import { ConflictException } from '@nestjs/common';
import { Base } from 'src/common/entities/base.entity';
import { User } from 'src/modules/auth/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Note } from './note.entity';

@Entity()
@Unique(['user', 'note'])
export class LikeNote extends Base {
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Note)
  @JoinColumn({ name: 'noteId' })
  note: Note;

  @Column({ type: 'bool' })
  liked: boolean;

  likeNote() {
    if (this.liked) {
      throw new ConflictException({
        code: 'note_already_liked',
      });
    }
    this.liked = true;
  }

  disLikeNote() {
    if (!this.liked) {
      throw new ConflictException({
        code: 'note_already_disliked',
      });
    }
    this.liked = false;
  }
}
