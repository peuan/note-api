import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { PublicNoteService } from '../services/public-note.service';

@Controller('public-notes')
@ApiTags('public-notes')
export class PublicNoteController {
  constructor(private readonly publicNoteService: PublicNoteService) {}
  @Auth()
  @Get()
  getNotes() {
    return [{ note: 'ss' }];
  }
}
