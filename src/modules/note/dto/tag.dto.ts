import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class CreateTagDto {
  @IsNotEmpty()
  tag: string;

  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  parentId?: string;
}

export class SearchTagsDto extends PaginationDto {
  
  search?: string;
}
