import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { NOTE_DISLIKED, NOTE_LIKED } from 'src/common/constants';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { NoteDislikedEvent } from 'src/modules/notification/events/note-disliked.event';
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
      if (user.id !== note.user.id) {
        this.eventEmitter.emit(
          NOTE_LIKED,
          new NoteLikedEvent(note.id, {
            userId: note.user.id,
            fromUserId: user.id,
            title: note.note,
          }),
        );
      }
      return await this.likeNoteRepository.save(like);
    }
    if (user.id !== note.user.id) {
      this.eventEmitter.emit(
        NOTE_LIKED,
        new NoteLikedEvent(note.id, {
          userId: note.user.id,
          fromUserId: user.id,
          title: note.note,
        }),
      );
    }

    note.totalLike = note.totalLike + 1;

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

    note.totalLike = note.totalLike - 1;

    const like = await this.likeNoteRepository.findOne({ note, user });

    if (!like) {
      throw new NotFoundException({ code: 'like_notfound' });
    }

    like.disLikeNote();
    if (user.id !== note.user.id) {
      this.eventEmitter.emit(
        NOTE_DISLIKED,
        new NoteDislikedEvent(note.id, {
          userId: note.user.id,
          fromUserId: user.id,
        }),
      );
    }

    return await this.likeNoteRepository.save(like);
  }

  async getLikesByNoteId(noteId: string, { page, limit }: PaginationDto) {
    const note = await this.noteRepository.findOne({
      where: {
        id: noteId,
        privacy: NotePrivacy.PUBLIC,
      },
    });
    if (!note) {
      throw new NotFoundException({
        code: 'note_notfound',
      });
    }
    return await paginate(
      this.likeNoteRepository,
      { page, limit },
      {
        where: { note, liked: true },
        order: {
          createDate: 'DESC',
        },
      },
    );
  }

  async getPublicNoteById(user: User, noteId: string) {
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
      .where('note.id = :noteId', { noteId });

    const note = await noteQueryBuilder.getOne();
    if (!note) {
      throw new NotFoundException({
        code: 'note_notfound',
      });
    }

    return note;
  }
}
