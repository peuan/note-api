import { Column, Entity } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { genSalt, hash } from 'bcrypt';

import { Base } from 'src/common/entitys/base.entity';
import { Scope } from 'src/common/enums/scope.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends Base {
  @Exclude()
  @Column({ unique: true })
  username: string;

  @Exclude()
  @ApiHideProperty()
  @Column()
  password: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'varchar', length: 255 })
  salt: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Exclude()
  @Column({ type: 'jsonb', nullable: true })
  scopes: Scope[];

  async validatePassword(passowrd: string): Promise<boolean> {
    const hashPassword = await hash(passowrd, this.salt);
    return hashPassword === this.password;
  }

  async hashPassword() {
    this.salt = await genSalt();
    this.password = await hash(this.password, this.salt);
  }
}
