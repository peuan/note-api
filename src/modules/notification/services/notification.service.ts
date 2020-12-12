import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TAG_DELETED } from 'src/common/constants';

@Injectable()
export class NotificationService {
  @OnEvent(TAG_DELETED, { async: true })
  handleOrderCreatedEvent(tagId: string) {
    console.log('tagId :>> ', tagId);
  }
}
