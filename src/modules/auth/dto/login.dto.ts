import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ example: 'note' })
  username: string;

  @ApiProperty({ example: 'noteP@ssword' })
  @IsString()
  password: string;
}
