import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  tag: string;

  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
