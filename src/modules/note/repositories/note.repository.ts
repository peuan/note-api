import { User } from 'src/modules/auth/entities/user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { Note } from '../entities/note.entity';

@EntityRepository(Note)
export class NoteRepository extends Repository<Note> {
  async findNoteByIdAndUser(user: User, noteId: string) {
    return await this.findOne(noteId, { where: { user: user } });
  }
}
