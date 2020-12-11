import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  NoteOptions,
  NotePrivacy,
  NoteType,
  NoteViews,
} from '../enums/note.enum';

export class CreateNoteDto {
  @IsString()
  note: string;

  @IsEnum(NoteType)
  type: NoteType;

  @IsEnum(NotePrivacy)
  privacy: NotePrivacy;

  @IsOptional()
  @IsString({ each: true })
  tagIds?: string[];
}

export class UpdateNoteDto {
  @IsString()
  note: string;

  @IsEnum(NotePrivacy)
  privacy: NotePrivacy;

  @IsOptional()
  @IsString({ each: true })
  tagIds?: string[];
}

export class UpdateNoteViewDto {
  @IsEnum(NoteViews)
  noteView: NoteViews;
}

export class QueryNoteDto extends PaginationDto {
  @ApiPropertyOptional({ default: NoteViews.ALL })
  public readonly noteView: NoteViews = NoteViews.ALL;

  @ApiPropertyOptional({ default: NoteType.NOTE })
  public readonly type: NoteType;
}

export class UpdateNoteOptionDto {
  @IsEnum(NoteOptions)
  option: NoteOptions;
}
