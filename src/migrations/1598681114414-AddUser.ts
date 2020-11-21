/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import { Scope } from 'src/common/enums/scope.enum';
import { genSalt, hash } from 'bcrypt';

export class AddUser1598681114414 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.connection.getRepository(User);
    const salt = await genSalt();
    const hashPassword = await hash(process.env.ADMIN_PASSWORD, salt);

    await userRepository.save({
      username: process.env.ADMIN_USERNAME,
      password: hashPassword,
      salt,
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin@gmail.com',
      scopes: [Scope.SUPER_ADMIN],
      enable: true,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
