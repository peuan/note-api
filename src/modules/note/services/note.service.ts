import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import { NotePrivacy } from '../enums/note.enum';
import { NoteRepository } from '../repositories/note.repository';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteRepository)
    private noteRepository: NoteRepository,
  ) {}

  async getNote(user: User, noteId) {
    const note = await this.noteRepository.findOne({
      where: {
        id: noteId,
      },
      relations: ['user'],
    });
    if (!note) {
      throw new NotFoundException({ code: 'note_not_found' });
    }
    if (note.user.id === user.id) {
      return note;
    }
    if (note.privacy === NotePrivacy.PRIVATE) {
      throw new ForbiddenException({ code: 'note_not_have_permission' });
    }
    return note;
  }
}
