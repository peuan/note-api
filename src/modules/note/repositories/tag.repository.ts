import { User } from 'src/modules/auth/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async findOneTagByUser(user: User, tag: string) {
    return await this.findOne({
      where: { user, tag },
    });
  }

  async findTagIdsByUser(user: User, tagIds: string[]) {
    return await this.findByIds(tagIds, { where: { user: user } });
  }
}