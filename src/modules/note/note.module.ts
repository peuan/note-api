import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { NoteRepository } from './repositories/note.repository';
import { NoteController } from './controllers/note.controller';
import { NoteService } from './services/note.service';
import { TagRepository } from './repositories/tag.repository';
import { TagService } from './services/tag.service';
import { TagController } from './controllers/tag.controller';

@Module({
  controllers: [NoteController, TagController],
  providers: [NoteService, TagService],
  imports: [TypeOrmModule.forFeature([NoteRepository, TagRepository])],
})
export class NoteModule {}
