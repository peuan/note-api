import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  getManyResponseFor,
  PaginationDto,
} from 'src/common/dto/pagination.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { LikeNote } from '../entities/like-note.entity';
import { Note } from '../entities/note.entity';
import { PublicNoteService } from '../services/public-note.service';

@Controller('public-notes')
@ApiTags('public-notes')
export class PublicNoteController {
  constructor(private readonly publicNoteService: PublicNoteService) {}

  @Auth()
  @Get()
  @ApiOkResponse({ type: getManyResponseFor(Note) })
  getNotes(@CurrentUser() user: User, @Query() paginationDto: PaginationDto) {
    return this.publicNoteService.getNotes(user, paginationDto);
  }

  @Auth()
  @Get(':noteId/likes')
  @ApiOkResponse({ type: getManyResponseFor(LikeNote) })
  getLikesByNoteId(
    @Query() paginationDto: PaginationDto,
    @Param('noteId') noteId: string,
  ) {
    return this.publicNoteService.getLikesByNoteId(noteId, paginationDto);
  }

  @Auth()
  @Put(':noteId/like')
  likeNote(@CurrentUser() user: User, @Param('noteId') noteId: string) {
    return this.publicNoteService.likeNote(user, noteId);
  }

  @Auth()
  @Put(':noteId/dislike')
  disLikeNote(@CurrentUser() user: User, @Param('noteId') noteId: string) {
    return this.publicNoteService.disLikeNote(user, noteId);
  }

  @Auth()
  @Get(':noteId')
  getPublicNoteById(
    @CurrentUser() user: User,
    @Param('noteId') noteId: string,
  ) {
    return this.publicNoteService.getPublicNoteById(user, noteId);
  }
}
