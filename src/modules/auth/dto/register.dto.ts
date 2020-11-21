import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
