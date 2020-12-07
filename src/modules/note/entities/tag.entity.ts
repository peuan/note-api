import { Base } from 'src/common/entitys/base.entity';
import { User } from 'src/modules/auth/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('nested-set')
export class Tag extends Base {
  
  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'text' })
  tag: string;

  @TreeChildren()
  children: Tag[];

  @TreeParent()
  parent: Tag;
}
