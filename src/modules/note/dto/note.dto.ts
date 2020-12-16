import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  NoteOption,
  NotePrivacy,
  NoteType,
  NoteView,
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
  @IsEnum(NoteView)
  noteView: NoteView;
}

export class QueryNoteDto extends PaginationDto {
  @ApiPropertyOptional({ default: NoteView.ALL })
  public readonly noteView: NoteView = NoteView.ALL;

  @ApiPropertyOptional({ default: NoteType.NOTE })
  public readonly type: NoteType;
}

export class UpdateNoteOptionDto {
  @IsEnum(NoteOption)
  option: NoteOption;
}
