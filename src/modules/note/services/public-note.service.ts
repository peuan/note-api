import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { NOTE_LIKED } from 'src/common/constants';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { NoteLikedEvent } from 'src/modules/notification/events/note-liked.event';
import { Note } from '../entities/note.entity';
import { NotePrivacy, NoteView } from '../enums/note.enum';
import { LikeNoteRepository } from '../repositories/like-note.repository';
import { NoteRepository } from '../repositories/note.repository';

@Injectable()
export class PublicNoteService {
  constructor(
    @InjectRepository(NoteRepository)
    private noteRepository: NoteRepository,
    @InjectRepository(LikeNoteRepository)
    private likeNoteRepository: LikeNoteRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async getNotes(user: User, { page, limit }: PaginationDto) {
    const noteQueryBuilder = this.noteRepository
      .createQueryBuilder('note')
      .loadRelationCountAndMap('note.isLiked', 'note.likes', 'liked', qb =>
        qb
          .andWhere(`liked.liked = :liked`, {
            liked: true,
          })
          .andWhere(`liked.userId = :userId`, {
            userId: user.id,
          }),
      )
      .leftJoinAndSelect('note.user', 'user')
      .andWhere(`note.noteView = :noteView and note.privacy = :notePrivacy`, {
        noteView: NoteView.ALL,
        notePrivacy: NotePrivacy.PUBLIC,
      })
      .orderBy('note.createDate', 'DESC');

    return await paginate<Note>(noteQueryBuilder, { page, limit });
  }

  async likeNote(user: User, noteId: string) {
    const note = await this.noteRepository.findOne({
      id: noteId,
      privacy: NotePrivacy.PUBLIC,
    });

    if (!note) {
      throw new NotFoundException({
        code: 'note_notfound',
      });
    }

    const like = await this.likeNoteRepository.findOne({ note, user });

    if (like) {
      like.likeNote();
      return await this.likeNoteRepository.save(like);
    }

    this.eventEmitter.emit(
      NOTE_LIKED,
      new NoteLikedEvent(note.id, {
        userId: note.user.id,
        fromUserId: user.id,
        title: note.note,
      }),
    );

    return await this.likeNoteRepository.save({ note, user, liked: true });
  }

  async disLikeNote(user: User, noteId: string) {
    const note = await this.noteRepository.findOne({
      id: noteId,
      privacy: NotePrivacy.PUBLIC,
    });

    if (!note) {
      throw new NotFoundException({
        code: 'note_notfound',
      });
    }

    const like = await this.likeNoteRepository.findOne({ note, user });

    if (!like) {
      throw new NotFoundException({ code: 'like_notfound' });
    }

    like.disLikeNote();

    return await this.likeNoteRepository.save(like);
  }
}
