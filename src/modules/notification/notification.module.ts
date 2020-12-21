import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './controllers/notification.controller';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationRepository])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
