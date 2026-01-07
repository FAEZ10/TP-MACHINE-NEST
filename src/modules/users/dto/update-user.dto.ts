import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'First name',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({
    example: 'Full-stack developer passionate about NestJS and React',
    description: 'User biography',
    required: false,
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({
    example: 'https://johndoe.dev',
    description: 'Personal website URL',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({
    example: 'https://github.com/johndoe',
    description: 'GitHub profile URL',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @ApiProperty({
    example: 'https://twitter.com/johndoe',
    description: 'Twitter profile URL',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  twitterUrl?: string;
}

