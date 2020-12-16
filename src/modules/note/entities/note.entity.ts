import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Base } from 'src/common/entitys/base.entity';
import {
  NoteType,
  NotePrivacy,
  NoteView,
  NoteOption,
} from '../enums/note.enum';
import { User } from 'src/modules/auth/entities/user.entity';
import { Tag } from './tag.entity';
import { UpdateNoteDto } from '../dto/note.dto';

@Entity()
export class Note extends Base {
  @ManyToOne(() => User)
  user: User;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @Column({ type: 'text' })
  note: string;

  @Column()
  type: NoteType;

  @Column()
  privacy: NotePrivacy;

  @Column({ default: NoteView.ALL })
  view: NoteView;

  @Column({ default: NoteOption.ACTIVE })
  option: NoteOption;

  updateDetail(updateNoteDto: UpdateNoteDto) {
    this.privacy = updateNoteDto.privacy;
    this.note = updateNoteDto.note;
  }

  updateView(noteView: NoteView) {
    this.view = noteView;
  }

  updateOption(option: NoteOption) {
    this.option = option;
  }
}
