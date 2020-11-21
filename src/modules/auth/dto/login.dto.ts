import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'note' })
  username: string;

  @ApiProperty({ example: 'noteP@ssword' })
  @IsNotEmpty()
  password: string;
}
