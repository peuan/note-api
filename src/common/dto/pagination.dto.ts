import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IPaginationMeta } from 'nestjs-typeorm-paginate';

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

export class GetManyResponse<Entity> {
  readonly items: Entity[];

  readonly meta: PaginationMeta;
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
