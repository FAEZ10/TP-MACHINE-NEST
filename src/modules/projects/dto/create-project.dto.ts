import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsUrl,
  MaxLength,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectCategory } from '../../../common/enums/project-category.enum';
import { ProjectStatus } from '../../../common/enums/project-status.enum';

export class CreateProjectDto {
  @ApiProperty({
    example: 'My Awesome SaaS',
    description: 'Project name',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'A revolutionary tool for developers',
    description: 'Short tagline describing the project',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  tagline: string;

  @ApiProperty({
    example: 'This is a comprehensive description of my awesome project. It solves real problems and helps developers be more productive.',
    description: 'Full project description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'https://myproject.com',
    description: 'Project website URL',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({
    example: 'https://github.com/username/myproject',
    description: 'Repository URL',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  repositoryUrl?: string;

  @ApiProperty({
    example: ProjectCategory.SAAS,
    enum: ProjectCategory,
    description: 'Project category',
    required: false,
    default: ProjectCategory.OTHER,
  })
  @IsEnum(ProjectCategory)
  @IsOptional()
  category?: ProjectCategory;

  @ApiProperty({
    example: ProjectStatus.LAUNCHED,
    enum: ProjectStatus,
    description: 'Project status',
    required: false,
    default: ProjectStatus.IN_DEVELOPMENT,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiProperty({
    example: ['NestJS', 'React', 'PostgreSQL', 'TypeScript'],
    description: 'Technologies used in the project',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  techStack?: string[];

  @ApiProperty({
    example: 'https://myproject.com/logo.png',
    description: 'Project logo URL',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({
    example: ['https://myproject.com/screenshot1.png', 'https://myproject.com/screenshot2.png'],
    description: 'Project screenshots URLs',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  screenshotUrls?: string[];

  @ApiProperty({
    example: '2024-01-15T00:00:00.000Z',
    description: 'Launch date',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  launchedAt?: Date;

  @ApiProperty({
    example: false,
    description: 'Whether the project is published (defaults to false - draft)',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

