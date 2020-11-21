import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { Base } from 'src/common/entitys/base.entity';
import {
  NoteType,
  NotePrivacy,
  NoteViews,
  NoteOptions,
} from '../enums/note.enum';
import { User } from 'src/modules/auth/entities/user.entity';

@Entity()
export class Note extends Base {
  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'text' })
  note: string;

  @Column()
  type: NoteType;

  @Column()
  privacy: NotePrivacy;

  @Column({ default: NoteViews.ALL })
  views: NoteViews;

  @Column({ default: NoteOptions.ACTIVE })
  options: NoteOptions;
}
