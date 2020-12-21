import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  getManyResponseFor,
  PaginationDto,
} from 'src/common/dto/pagination.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { Notification } from '../entities/notification.entity';
import { NotificationService } from '../services/notification.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Auth()
  @Get()
  @ApiOkResponse({ type: getManyResponseFor(Notification) })
  getNotifications(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.notificationService.getNotifications(user, paginationDto);
  }

  @Auth()
  @Put(':notificationId/read')
  readNotification(
    @CurrentUser() user: User,
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationService.readNotification(user, notificationId);
  }
}
