import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/modules/auth/entities/user.entity';
import { CreateTagDto } from '../dto/tag.dto';
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
  getTags(
    @CurrentUser()
    user: User,
  ) {
    return this.tagService.getTags(user);
  }
}
