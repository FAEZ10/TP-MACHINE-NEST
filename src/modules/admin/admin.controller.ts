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
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user@example.com',
          username: 'username',
          role: 'USER',
        },
      ],
    },
  })
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'User details',
  })
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Patch('users/:id/role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user role' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
  })
  updateUserRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.adminService.updateUserRole(id, updateRoleDto);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: {
        message: 'User deleted successfully',
      },
    },
  })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('projects')
  @ApiOperation({ summary: 'Get all projects (including drafts)' })
  @ApiResponse({
    status: 200,
    description: 'List of all projects',
  })
  getAllProjects() {
    return this.adminService.getAllProjects();
  }

  @Get('projects/user/:userId')
  @ApiOperation({ summary: 'Get projects by user ID' })
  @ApiParam({ name: 'userId', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'List of user projects',
  })
  getProjectsByUser(@Param('userId') userId: string) {
    return this.adminService.getProjectsByUser(userId);
  }

  @Delete('projects/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete any project' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully',
    schema: {
      example: {
        message: 'Project deleted successfully',
      },
    },
  })
  deleteProject(@Param('id') id: string) {
    return this.adminService.deleteProject(id);
  }

  @Patch('projects/:id/moderate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Moderate project (unpublish)' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Project moderated successfully',
  })
  moderateProject(@Param('id') id: string) {
    return this.adminService.moderateProject(id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get platform statistics' })
  @ApiResponse({
    status: 200,
    description: 'Platform statistics',
    schema: {
      example: {
        totalUsers: 150,
        totalProjects: 75,
        publishedProjects: 60,
        totalUpvotes: 500,
        recentUsers: 25,
      },
    },
  })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('stats/trending')
  @ApiOperation({ summary: 'Get trending technologies' })
  @ApiResponse({
    status: 200,
    description: 'Trending technologies',
    schema: {
      example: [
        { name: 'NestJS', count: 45 },
        { name: 'React', count: 38 },
        { name: 'TypeScript', count: 32 },
      ],
    },
  })
  getTrendingTech() {
    return this.adminService.getTrendingTech();
  }
}

