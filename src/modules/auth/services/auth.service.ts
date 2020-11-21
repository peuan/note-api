import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from '../repositories/user.repository';
import { LoginDto } from '../dto/login.dto';
import { RedisService } from 'src/redis/redis.service';
import { User } from '../entities/user.entity';
import { Scope } from 'src/common/enums/scope.enum';
import { LoginResponse } from '../classes/login-response.classes';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async adminLogin(loginDto: LoginDto) {
    const admin = await this.userRepository.validateUserPassword(loginDto);
    if (!admin) {
      throw new UnauthorizedException('invalid username or password');
    }
    const isScopeAdmin = admin.scopes.some(
      scope => scope === Scope.SUPER_ADMIN || scope === Scope.ADMIN,
    );
    if (!isScopeAdmin) {
      throw new UnauthorizedException('invalid username or password');
    }
    return await this.genToken(admin);
  }

  async genToken(user: User): Promise<LoginResponse> {
    const accessTokenId = uuidv4();
    const accessToken = await this.jwtService.signAsync(
      {},
      {
        jwtid: accessTokenId,
        subject: user.id,
        algorithm: 'HS512',
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXP'),
      },
    );

    this.redisService.setAccessToken(user.id, accessTokenId, user.scopes);

    const refreshTokenId = uuidv4();
    const refreshToken = await this.jwtService.signAsync(
      {},
      {
        jwtid: refreshTokenId,
        subject: user.id,
        algorithm: 'HS512',
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXP'),
      },
    );
    this.redisService.setRefreshToken(user.id, refreshTokenId);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...responseUser } = user;
    return {
      user: responseUser as User,
      accessToken,
      refreshToken,
    };
  }

  async userRegister(registerDto: RegisterDto) {
    const user = await this.userRepository.findByUsername(registerDto.username);

    if (user) {
      throw new ConflictException({ code: 'username_already_exist' });
    }

    const newUser = this.userRepository.create(registerDto);
    await newUser.hashPassword();

    return await this.userRepository.save(newUser);
  }
}
