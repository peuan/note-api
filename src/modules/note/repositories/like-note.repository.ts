import { Repository, EntityRepository } from 'typeorm';
import { LikeNote } from '../entities/like-note.entity';

@EntityRepository(LikeNote)
export class LikeNoteRepository extends Repository<LikeNote> {}
