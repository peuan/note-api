import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { PermissionModule } from './permission/permission.module';
import { NoteModule } from './note/note.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AuthModule, UploadModule, PermissionModule, NoteModule, NotificationModule],
})
export class ModulesModule {}


