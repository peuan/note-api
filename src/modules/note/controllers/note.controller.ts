import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  getManyResponseFor,
  PaginationDto,
} from 'src/common/dto/pagination.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import {
  CreateNoteDto,
  UpdateNoteDto,
  UpdateNoteViewDto,
} from '../dto/note.dto';
import { Note } from '../entities/note.entity';
import { NoteService } from '../services/note.service';

@Controller('notes')
@ApiTags('notes')
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

  @Auth()
  @Post()
  addNote(@Body() createNoteDto: CreateNoteDto, @CurrentUser() user: User) {
    return this.noteService.addNote(user, createNoteDto);
  }

  @Auth()
  @Put(':noteId')
  updateNote(
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @CurrentUser() user: User,
  ) {
    return this.noteService.updateNote(user, noteId, updateNoteDto);
  }

  @Auth()
  @Put(':noteId/note-view')
  updateNoteView(
    @Param('noteId') noteId: string,
    @Body() updateNoteViewDto: UpdateNoteViewDto,
    @CurrentUser() user: User,
  ) {
    return this.noteService.updateNoteView(
      user,
      noteId,
      updateNoteViewDto.noteView,
    );
  }

  @Auth()
  @Get('')
  @ApiOkResponse({ type: getManyResponseFor(Note) })
  getNotes(
    @Query() paginationDto: PaginationDto,
    @CurrentUser()
    user: User,
  ) {
    return this.noteService.getNotes(user, paginationDto);
  }
}
