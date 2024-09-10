import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum SortField {
  createdAt = 'createdAt',
}

export class PaginateNotificationsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number = 0

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20

  @IsOptional()
  @IsString()
  @IsEnum(SortField)
  sortedField?: SortField = SortField.createdAt

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection = SortDirection.DESC

  @IsString()
  @IsNotEmpty()
  group!: string
}
