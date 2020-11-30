import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { EntityManager, IsNull } from 'typeorm';
import { CreateTagDto } from '../dto/tag.dto';
import { Tag } from '../entities/tag.entity';
import { TagRepository } from '../repositories/tag.repository';
@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagRepository)
    private tagRepository: TagRepository,
    private entityManager: EntityManager,
  ) {}

  async addTag(user: User, createTagDto: CreateTagDto):Promise<Tag> {
    const findTag = await this.tagRepository.findByTagAndUser(
      user,
      createTagDto.tag,
    );

    if (findTag) {
      throw new NotFoundException({ code: 'tag_already_exist' });
    }
    if (createTagDto.parentId) {
      const parent = await this.tagRepository.findOne({
        where: { id: createTagDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException({ code: 'tag_parent_not_found' });
      }
      return await this.tagRepository.save({ user, parent, ...createTagDto });
    }
    return await this.tagRepository.save({ user, ...createTagDto });
  }

  async getTagById(user: User, tagId: string) {
    const tag = await this.tagRepository.findOne({
      where: { user, id: tagId },
    });
    if (!tag) {
      throw new NotFoundException({ code: 'tag_not_found' });
    }
    return tag;
  }

  async getTags(user: User, { page, limit }: PaginationDto) {
    const response = [];

    const manyResponse = await paginate(
      this.tagRepository,
      { page, limit },
      {
        where: { user, parent: IsNull() },
      },
    );

    for await (const parent of manyResponse.items) {
      const children = await this.entityManager
        .getTreeRepository(Tag)
        .findDescendantsTree(parent);
      response.push(children);
    }
    return { ...manyResponse, items: response };
  }
}
