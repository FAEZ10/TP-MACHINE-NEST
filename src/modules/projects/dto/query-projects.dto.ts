import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectCategory } from '../../../common/enums/project-category.enum';

export class QueryProjectsDto {
  @ApiProperty({
    example: 'SaaS',
    description: 'Search term to filter projects',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: ProjectCategory.SAAS,
    enum: ProjectCategory,
    description: 'Filter by project category',
    required: false,
  })
  @IsOptional()
  @IsEnum(ProjectCategory)
  category?: ProjectCategory;

  @ApiProperty({
    example: 1,
    description: 'Page number',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    example: 20,
    description: 'Number of items per page',
    required: false,
    default: 20,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;

  @ApiProperty({
    example: 'latest',
    enum: ['latest', 'trending', 'popular'],
    description: 'Sort order',
    required: false,
    default: 'latest',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'latest' | 'trending' | 'popular' = 'latest';
}

