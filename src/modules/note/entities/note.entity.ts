import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationCount,
} from 'typeorm';
import { Base } from 'src/common/entities/base.entity';
import {
  NoteType,
  NotePrivacy,
  NoteView,
  NoteOption,
} from '../enums/note.enum';
import { User } from 'src/modules/auth/entities/user.entity';
import { Tag } from './tag.entity';
import { UpdateNoteDto } from '../dto/note.dto';
import { LikeNote } from './like-note.entity';

@Entity()
export class Note extends Base {
  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToMany(() => Tag, { eager: true })
  @JoinTable()
  tags: Tag[];

  @OneToMany(
    () => LikeNote,
    likeNote => likeNote.note,
  )
  likes: LikeNote[];

  @RelationCount(
    (note: Note) => note.likes,
    'like',
    qb => qb.andWhere('like.liked = :liked', { liked: true }),
  )
  totalLike: number;

  @Column({ type: 'text' })
  note: string;

  @Column()
  type: NoteType;

  @Column()
  privacy: NotePrivacy;

  @Column({ default: NoteView.ALL })
  noteView: NoteView;

  @Column({ default: NoteOption.ACTIVE })
  option: NoteOption;

  updateDetail(updateNoteDto: UpdateNoteDto) {
    this.privacy = updateNoteDto.privacy;
    this.note = updateNoteDto.note;
  }

  updateView(noteView: NoteView) {
    this.noteView = noteView;
  }

  updateOption(option: NoteOption) {
    this.option = option;
  }

  isLiked?: boolean;
}
