import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  getManyResponseFor,
} from 'src/common/dto/pagination.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { CreateTagDto, SearchTagsDto } from '../dto/tag.dto';
import { Tag } from '../entities/tag.entity';
import { TagService } from '../services/tag.service';

@Controller('tags')
@ApiTags('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Auth()
  @Post()
  addTag(@Body() createTagDto: CreateTagDto, @CurrentUser() user: User) {
    return this.tagService.addTag(user, createTagDto);
  }

  @Auth()
  @Get(':tagId')
  getTagById(
    @Param('tagId')
    tagId: string,
    @CurrentUser()
    user: User,
  ) {
    return this.tagService.getTagById(user, tagId);
  }

  @Auth()
  @Get('')
  @ApiOkResponse({ type: getManyResponseFor(Tag) })
  getTags(
    @CurrentUser()
    user: User,
    @Query() searchTagsDto: SearchTagsDto,
  ) {
    if (searchTagsDto.search) {
      return this.tagService.searchTags(user, searchTagsDto);
    }
    return this.tagService.getTags(user, searchTagsDto);
  }

  @Auth()
  @Delete(':tagId')
  deleteTag(@CurrentUser() user: User, @Param('tagId') tagId: string) {
    return this.tagService.deleteTag(user, tagId);
  }
}
