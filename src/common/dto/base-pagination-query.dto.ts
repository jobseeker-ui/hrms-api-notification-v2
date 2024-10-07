import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BasePaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20

  @IsOptional()
  @IsString()
  sortedField?: string = 'created_at'

  @IsOptional()
  @IsString()
  q?: string

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection = SortDirection.DESC
}
