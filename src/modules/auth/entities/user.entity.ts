import { Column, Entity } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { genSalt, hash } from 'bcrypt';

import { Base } from 'src/common/entities/base.entity';
import { Scope } from 'src/common/enums/scope.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends Base {
  @Column({ unique: true, select: false })
  username: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ select: false })
  password: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'varchar', length: 255, select: false })
  salt: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Exclude()
  @Column({ type: 'jsonb', nullable: true, select: false })
  scopes: Scope[];

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await hash(password, this.salt);
    return hashPassword === this.password;
  }

  async hashPassword() {
    this.salt = await genSalt();
    this.password = await hash(this.password, this.salt);
  }
}
