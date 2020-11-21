import { Column, Entity } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { hash } from 'bcrypt';

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
  @Column({ select: false, nullable: true })
  password: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  salt: string;

  @Exclude()
  @Column({ type: 'jsonb', nullable: true })
  scopes: Scope[];

  async validatePassword(passowrd: string): Promise<boolean> {
    const hashPassword = await hash(passowrd, this.salt);
    return hashPassword === this.password;
  }
}
