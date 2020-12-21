import { User } from 'src/modules/auth/entities/user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  async findActiveOneByNoteAndUsers(
    noteId: string,
    userId: string,
    fromUserId: string,
  ): Promise<Notification> {
    return await this.createQueryBuilder('noti')
      .leftJoinAndSelect('noti.user', 'user')
      .leftJoinAndSelect('noti.fromUser', 'fromUser')
      .where(
        'noti.noteId = :noteId and user.id=:userId and fromUser.id = :fromUserId and noti.active=:active',
        {
          noteId,
          userId,
          fromUserId,
          active: true,
        },
      )
      .getOne();
  }

  async findByIdAndUser(user: User, notificationId: string) {
    return await this.findOne({
      where: {
        user,
        id: notificationId,
      },
    });
  }
}
