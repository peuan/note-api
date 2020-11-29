import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { NotePrivacy, NoteType } from '../enums/note.enum';

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
