import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { NOTE_LIKED } from 'src/common/constants';
import { User } from 'src/modules/auth/entities/user.entity';
import { Note } from 'src/modules/note/entities/note.entity';
import { NoteLikedEvent } from '../events/note-liked.event';
import { NotificationRepository } from '../repositories/notification.repository';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRepository)
    private notificationRepository: NotificationRepository,
    private entityManager: EntityManager,
  ) {}

  @OnEvent(NOTE_LIKED)
  async handleNoteLikedEvent({ noteId, payload }: NoteLikedEvent) {
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
}
