import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import { CreateNoteDto } from '../dto/note.dto';
import { Tag } from '../entities/tag.entity';
import { NotePrivacy } from '../enums/note.enum';
import { NoteRepository } from '../repositories/note.repository';
import { TagRepository } from '../repositories/tag.repository';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteRepository)
    private noteRepository: NoteRepository,
    @InjectRepository(TagRepository)
    private tagRepository: TagRepository,
  ) {}

  async getNote(user: User, noteId) {
    const note = await this.noteRepository.findOne({
      where: {
        id: noteId,
      },
      relations: ['user', 'tags'],
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

  async addNote(user: User, noteDto: CreateNoteDto) {
    let tags: Tag[] = [];
    if (noteDto.tagIds) {
      tags = await this.tagRepository.findTagIdsByUser(user, noteDto.tagIds);
      if (tags.length < noteDto.tagIds.length) {
        throw new NotFoundException({ code: 'tag_not_found' });
      }
    }

    return await this.noteRepository.save({
      user: user,
      tags,
      ...noteDto,
    });
  }
}
