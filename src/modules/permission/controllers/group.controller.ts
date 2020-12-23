import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GroupService } from '../services/group.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Scope } from 'src/common/enums/scope.enum';
import { UpdateGroupDto } from '../dto/update-group.dto';

@Auth([Scope.SUPER_ADMIN])
@Controller('groups')
@ApiTags('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get('')
  getGroups() {
    return this.groupService.getGroups();
  }

  @Post()
  createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGroup(createGroupDto);
  }

  @Put(':groupId')
  updateGroup(
    @Param('groupId') groupId: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupService.updateGroup(groupId, updateGroupDto);
  }
}
