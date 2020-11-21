import { IsEnum, IsString } from 'class-validator';
import { NotePrivacy, NoteType } from '../enums/note.enum';

export class CreateNoteDto {
  @IsString()
  note: string;

  @IsEnum(NoteType)
  type: NoteType;

  @IsEnum(NotePrivacy)
  privacy: NotePrivacy;
}
