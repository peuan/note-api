import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { NoteRepository } from './repositories/note.repository';
import { NoteController } from './controllers/note.controller';
import { NoteService } from './services/note.service';

@Module({
  controllers: [NoteController],
  providers: [NoteService],
  imports: [TypeOrmModule.forFeature([NoteRepository])],
})
export class NoteModule {}
