import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { PermissionModule } from './permission/permission.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [AuthModule, UploadModule, PermissionModule, NoteModule],
})
export class ModulesModule {}
