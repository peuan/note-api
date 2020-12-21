import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { NOTE_DISLIKED, NOTE_LIKED } from 'src/common/constants';
import { User } from 'src/modules/auth/entities/user.entity';
import { Note } from 'src/modules/note/entities/note.entity';
import { NoteLikedEvent } from '../events/note-liked.event';
import { NotificationRepository } from '../repositories/notification.repository';
import { Notification } from '../entities/notification.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { NoteDislikedEvent } from '../events/note-disliked.event';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRepository)
    private notificationRepository: NotificationRepository,
    private entityManager: EntityManager,
  ) {}

  @OnEvent(NOTE_LIKED)
  private async handleNoteLikedEvent({ noteId, payload }: NoteLikedEvent) {
    const note = await this.entityManager.findOne(Note, noteId);
    const user = await this.entityManager.findOne(User, payload.userId);
    const fromUser = await this.entityManager.findOne(User, payload.fromUserId);
    if (!note) {
      throw new NotFoundException();
    }
    if (!user) {
      throw new NotFoundException();
    }
    if (!fromUser) {
      throw new NotFoundException();
    }

    const notification = new Notification();

    notification.likedNote({
      user,
      fromUser,
      noteId,
      title: payload.title,
    });

    await this.notificationRepository.save(notification);
  }

  @OnEvent(NOTE_DISLIKED)
  private async handleNoteDislikedEvent({
    noteId,
    payload: { userId, fromUserId },
  }: NoteDislikedEvent) {
    const notification = await this.notificationRepository.findActiveOneByNoteAndUsers(
      noteId,
      userId,
      fromUserId,
    );
    if (!notification) {
      throw new NotFoundException();
    }

    notification.dislike();

    await this.notificationRepository.save(notification);
  }

  async getNotifications(user: User, { page, limit }: PaginationDto) {
    return await paginate(
      this.notificationRepository,
      { page, limit },
      {
        where: { user, active: true },
        order: {
          createDate: 'DESC',
        },
      },
    );
  }

  async readNotification(user: User, notificationId: string) {
    const notification = await this.notificationRepository.findByIdAndUser(
      user,
      notificationId,
    );
    if (!notification) {
      throw new NotFoundException({
        code: 'notification_notfound',
      });
    }
    notification.readNotification();

    return await this.notificationRepository.save(notification);
  }
}
