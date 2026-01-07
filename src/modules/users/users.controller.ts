import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { PublicEndpoint } from '../../common/decorators/public-endpoint.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john.doe@example.com',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Full-stack developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        websiteUrl: 'https://johndoe.dev',
        githubUrl: 'https://github.com/johndoe',
        twitterUrl: 'https://twitter.com/johndoe',
        role: 'USER',
        emailValidatedAt: '2024-01-15T10:00:00.000Z',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z',
      },
    },
  })
  findMe(@CurrentUser() user: User) {
    return this.usersService.findMe(user.id);
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john.doe@example.com',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Updated bio',
        avatarUrl: 'https://example.com/new-avatar.jpg',
        websiteUrl: 'https://johndoe.dev',
        githubUrl: 'https://github.com/johndoe',
        twitterUrl: 'https://twitter.com/johndoe',
        role: 'USER',
        emailValidatedAt: '2024-01-15T10:00:00.000Z',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T11:00:00.000Z',
      },
    },
  })
  updateMe(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateMe(user.id, updateUserDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully',
    schema: {
      example: {
        message: 'Account deleted successfully',
      },
    },
  })
  deleteMe(@CurrentUser() user: User) {
    return this.usersService.deleteMe(user.id);
  }

  @Get(':username')
  @PublicEndpoint()
  @ApiOperation({ summary: 'Get public user profile by username' })
  @ApiParam({
    name: 'username',
    example: 'johndoe',
    description: 'Username of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john.doe@example.com',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Full-stack developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        websiteUrl: 'https://johndoe.dev',
        githubUrl: 'https://github.com/johndoe',
        twitterUrl: 'https://twitter.com/johndoe',
        role: 'USER',
        emailValidatedAt: '2024-01-15T10:00:00.000Z',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z',
        projects: [
          {
            id: '223e4567-e89b-12d3-a456-426614174000',
            name: 'My Awesome Project',
            tagline: 'A revolutionary tool',
            isPublished: true,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}

