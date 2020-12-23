import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MenuService } from '../services/menu.service';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Scope } from 'src/common/enums/scope.enum';
import { UpdateMenuDto } from '../dto/update-menu.dto';

@Auth([Scope.SUPER_ADMIN])
@Controller('menus')
@ApiTags('menus')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get('')
  getMenus() {
    return this.menuService.getMenus();
  }

  @Post()
  createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Put(':menuId')
  updateMenu(
    @Param('menuId') menuId: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.updateMenu(menuId, updateMenuDto);
  }
}
