import {
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Scope } from 'src/common/enums/scope.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ICurrentUser } from '../../../common/interfaces/curret-user.interface';
import { QueryOptionDto } from 'src/common/dto/query-option.dto';
import { RegisterDto } from '../dto/register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Auth()
  @Get('')
  getProfile(@CurrentUser() user: ICurrentUser) {
    return user;
  }

  @Post('register')
  userRegister(
    @Body()
    registerDto: RegisterDto,
  ) {
    return this.authService.userRegister(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  userLogin(@Body() loginDto: LoginDto) {
    return this.authService.userLogin(loginDto);
  }
}
