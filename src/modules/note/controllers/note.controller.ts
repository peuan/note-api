import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/modules/auth/entities/user.entity';
import { NoteService } from '../services/note.service';

@Controller('notes')
@ApiTags('notes')
@UseInterceptors(ClassSerializerInterceptor)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Auth()
  @Get(':noteId')
  getNote(
    @Param('noteId')
    noteId: string,
    @CurrentUser()
    user: User,
  ) {
    return this.noteService.getNote(user, noteId);
  }
}
