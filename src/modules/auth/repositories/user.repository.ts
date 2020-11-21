import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto } from '../dto/login.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async validateUserPassword(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.selectUser(username);

    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }

  async selectUser(username: string) {
    return await this.findOne({
      select: [
        'username',
        'password',
        'salt',
        'id',
        'createDate',
        'scopes',
        'updateDate',
      ],
      where: {
        username,
      },
    });
  }

  async findByUsername(username: string) {
    return await this.findOne({
      where: {
        username,
      },
    });
  }
}
