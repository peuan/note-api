import { Controller, Post, Body, Put, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePageDto } from '../dto/create-page.dto';
import { UpdatePageDto } from '../dto/update-page.dto';
import { PageService } from '../services/page.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Scope } from 'src/common/enums/scope.enum';

@Auth([Scope.SUPER_ADMIN])
@Controller('pages')
@ApiTags('pages')
export class PageController {
  constructor(private pageService: PageService) {}
  @Post()
  createPage(@Body() createPageDto: CreatePageDto) {
    return this.pageService.createPage(createPageDto);
  }

  @Put(':pageId')
  updatePage(
    @Param('pageId') pageId: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pageService.updatePage(pageId, updatePageDto);
  }
}
