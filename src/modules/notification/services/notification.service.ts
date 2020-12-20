import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NOTE_LIKED, TAG_DELETED } from 'src/common/constants';
import { NoteLikedEvent } from '../events/note-liked.event';

@Injectable()
export class NotificationService {
  @OnEvent(TAG_DELETED, { async: true })
  handleTagCreatedEvent(tagId: string) {
    console.log('tagId :>> ', tagId);
  }

  @OnEvent(NOTE_LIKED)
  async handleNoteLikedEvent({ noteId, payload }: NoteLikedEvent) {
    console.log(noteId, payload);
  }
}
