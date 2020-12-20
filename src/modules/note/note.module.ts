import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { NoteRepository } from './repositories/note.repository';
import { NoteController } from './controllers/note.controller';
import { NoteService } from './services/note.service';
import { TagRepository } from './repositories/tag.repository';
import { TagService } from './services/tag.service';
import { TagController } from './controllers/tag.controller';
import { PublicNoteController } from './controllers/public-note.controller';
import { PublicNoteService } from './services/public-note.service';
import { LikeNoteRepository } from './repositories/like-note.repository';

@Module({
  controllers: [NoteController, TagController, PublicNoteController],
  providers: [NoteService, TagService, PublicNoteService],
  imports: [
    TypeOrmModule.forFeature([
      NoteRepository,
      TagRepository,
      LikeNoteRepository,
    ]),
  ],
})
export class NoteModule {}
