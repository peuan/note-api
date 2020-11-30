import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IPaginationLinks, IPaginationMeta } from 'nestjs-typeorm-paginate';

export enum OrderBy {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  readonly page: number = 1;

  @ApiPropertyOptional({ default: 10 })
  readonly limit: number = 10;
}

class PaginationMeta implements IPaginationMeta {
  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}

class PaginationLinks implements IPaginationLinks {
  @ApiPropertyOptional()
  first?: string;

  @ApiPropertyOptional()
  previous?: string;

  @ApiPropertyOptional()
  next?: string;

  @ApiPropertyOptional()
  last?: string;
}

export class GetManyResponse<Entity> {
  readonly items: Entity[];

  readonly meta: PaginationMeta;

//   readonly links: PaginationLinks;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type Entity = Function;

export function getManyResponseFor(type: Entity): typeof GetManyResponse {
  class GetManyResponseForEntity<Entity> extends GetManyResponse<Entity> {
    @ApiProperty({ type, isArray: true })
    public items: Entity[];
  }

  Object.defineProperty(GetManyResponseForEntity, 'name', {
    value: `GetManyResponseFor${type.name}`,
  });

  return GetManyResponseForEntity;
}
