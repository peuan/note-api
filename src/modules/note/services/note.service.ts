import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { User } from 'src/modules/auth/entities/user.entity';
import { CreateNoteDto, QueryNoteDto, UpdateNoteDto } from '../dto/note.dto';
import { Note } from '../entities/note.entity';
import { Tag } from '../entities/tag.entity';
import { NoteOption, NotePrivacy, NoteView } from '../enums/note.enum';
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

  async getNote(user: User, noteId: string) {
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

  async addNote(user: User, createNoteDto: CreateNoteDto) {
    let tags: Tag[] = [];
    if (createNoteDto.tagIds) {
      tags = await this.tagRepository.findTagฺByIdsAndUser(
        user,
        createNoteDto.tagIds,
      );
      if (tags.length < createNoteDto.tagIds.length) {
        throw new NotFoundException({ code: 'tag_not_found' });
      }
    }

    return await this.noteRepository.save({
      user: user,
      tags,
      ...createNoteDto,
    });
  }

  async updateNote(user: User, noteId: string, updateNoteDto: UpdateNoteDto) {
    let tags: Tag[] = [];
    const note = await this.noteRepository.findNoteByIdAndUser(user, noteId);

    if (!note) {
      throw new NotFoundException({ code: 'note_not_found' });
    }

    if (updateNoteDto.tagIds) {
      tags = await this.tagRepository.findTagฺByIdsAndUser(
        user,
        updateNoteDto.tagIds,
      );
      if (tags.length < updateNoteDto.tagIds.length) {
        throw new NotFoundException({ code: 'tag_not_found' });
      }
    }

    note.updateDetail(updateNoteDto);

    return await this.noteRepository.save({
      ...note,
      tags,
    });
  }

  async getNotes(user: User, { page, limit, noteView }: QueryNoteDto) {
    const noteQueryBuilder = this.noteRepository
      .createQueryBuilder('note')
      .addSelect(
        `CASE WHEN "note"."option" = '${NoteOption.PIN}' THEN 1
                        ELSE 0
                    END`,
        'pin',
      )
      .leftJoinAndSelect('note.user', 'user', 'user.id = :userId', {
        userId: user.id,
      })
      .leftJoinAndSelect('note.tags','tags')
      .andWhere(
        `user.id = :userId 
      and note.noteView = :noteView

      `,
        {
          userId: user.id,
          noteView,
        },
      )
      .orderBy('pin', 'DESC')
      .addOrderBy('note.createDate', 'DESC');

    return await paginate<Note>(noteQueryBuilder, { page, limit });
  }

  async updateNoteView(user: User, noteId: string, noteView: NoteView) {
    const note = await this.noteRepository.findNoteByIdAndUser(user, noteId);

    if (!note) {
      throw new NotFoundException({ code: 'note_not_found' });
    }

    note.updateView(noteView);

    return await this.noteRepository.save(note);
  }

  async updateNoteOption(user: User, noteId: string, option: NoteOption) {
    const note = await this.noteRepository.findNoteByIdAndUser(user, noteId);

    if (!note) {
      throw new NotFoundException({ code: 'note_not_found' });
    }

    note.updateOption(option);

    return await this.noteRepository.save(note);
  }
}
