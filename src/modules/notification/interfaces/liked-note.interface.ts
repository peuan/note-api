import { User } from 'src/modules/auth/entities/user.entity';

export interface LikedNote {
  noteId: string;
  user: User;
  fromUser: User;
  title: string;
}
