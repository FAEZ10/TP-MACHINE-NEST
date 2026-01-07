import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PublicEndpoint } from '../../common/decorators/public-endpoint.decorator';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('public')
  @PublicEndpoint()
  @ApiOperation({ summary: 'Get list of published projects' })
  @ApiResponse({
    status: 200,
    description: 'List of published projects',
    schema: {
      example: {
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'My Awesome Project',
            tagline: 'A revolutionary tool',
            description: 'Full description...',
            websiteUrl: 'https://myproject.com',
            category: 'SAAS',
            status: 'LAUNCHED',
            techStack: ['NestJS', 'React'],
            upvotesCount: 42,
            isPublished: true,
            user: {
              id: '223e4567-e89b-12d3-a456-426614174000',
              username: 'johndoe',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
        ],
        meta: {
          total: 100,
          page: 1,
          limit: 20,
          totalPages: 5,
        },
      },
    },
  })
  getPublicProjects(@Query() query: QueryProjectsDto) {
    return this.projectsService.getPublicProjects(query);
  }

  @Get('public/:id')
  @PublicEndpoint()
  @ApiOperation({ summary: 'Get published project by ID' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Project details',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'My Awesome Project',
        tagline: 'A revolutionary tool',
        description: 'Full description...',
        websiteUrl: 'https://myproject.com',
        category: 'SAAS',
        status: 'LAUNCHED',
        techStack: ['NestJS', 'React'],
        upvotesCount: 42,
        isPublished: true,
        user: {
          id: '223e4567-e89b-12d3-a456-426614174000',
          username: 'johndoe',
        },
      },
    },
  })
  getPublicProjectById(@Param('id') id: string) {
    return this.projectsService.getPublicProjectById(id);
  }

  @Get('trending')
  @PublicEndpoint()
  @ApiOperation({ summary: 'Get trending projects' })
  @ApiResponse({
    status: 200,
    description: 'List of trending projects',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Trending Project',
          upvotesCount: 150,
          isPublished: true,
        },
      ],
    },
  })
  getTrendingProjects() {
    return this.projectsService.getTrendingProjects();
  }

  @Get('latest')
  @PublicEndpoint()
  @ApiOperation({ summary: 'Get latest published projects' })
  @ApiResponse({
    status: 200,
    description: 'List of latest projects',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'New Project',
          createdAt: '2024-01-15T10:00:00.000Z',
          isPublished: true,
        },
      ],
    },
  })
  getLatestProjects() {
    return this.projectsService.getLatestProjects();
  }

  @Get('search')
  @PublicEndpoint()
  @ApiOperation({ summary: 'Search projects' })
  @ApiQuery({ name: 'q', example: 'SaaS', description: 'Search term' })
  @ApiResponse({
    status: 200,
    description: 'Search results',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Found Project',
          tagline: 'Matches search term',
        },
      ],
    },
  })
  searchProjects(@Query('q') searchTerm: string) {
    return this.projectsService.searchProjects(searchTerm);
  }

  @Get('category/:category')
  @PublicEndpoint()
  @ApiOperation({ summary: 'Get projects by category' })
  @ApiParam({ name: 'category', example: 'SAAS', description: 'Project category' })
  @ApiResponse({
    status: 200,
    description: 'List of projects in category',
  })
  getProjectsByCategory(@Param('category') category: string) {
    return this.projectsService.getProjectsByCategory(category);
  }

  @Get('my-projects')
  @ApiOperation({ summary: 'Get my projects (including drafts)' })
  @ApiResponse({
    status: 200,
    description: 'List of user projects',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'My Project',
          isPublished: false,
        },
      ],
    },
  })
  getMyProjects(@CurrentUser() user: User) {
    return this.projectsService.getMyProjects(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'My Awesome Project',
        tagline: 'A revolutionary tool',
        isPublished: false,
        userId: '223e4567-e89b-12d3-a456-426614174000',
      },
    },
  })
  createProject(
    @CurrentUser() user: User,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.createProject(user.id, createProjectDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Project details',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'My Project',
        isPublished: true,
      },
    },
  })
  getProjectById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.getProjectById(id, user?.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
  })
  updateProject(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(id, user.id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete project' })
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
  deleteProject(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.deleteProject(id, user.id);
  }

  @Patch(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish project' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Project published successfully',
  })
  publishProject(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.publishProject(id, user.id);
  }

  @Patch(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unpublish project' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Project unpublished successfully',
  })
  unpublishProject(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.unpublishProject(id, user.id);
  }

  @Post(':id/upvote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upvote a project' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Project upvoted successfully',
    schema: {
      example: {
        message: 'Project upvoted successfully',
      },
    },
  })
  upvoteProject(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.upvoteProject(id, user.id);
  }

  @Delete(':id/upvote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove upvote from project' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'Upvote removed successfully',
    schema: {
      example: {
        message: 'Upvote removed successfully',
      },
    },
  })
  removeUpvote(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.removeUpvote(id, user.id);
  }

  @Get(':id/upvotes')
  @PublicEndpoint()
  @ApiOperation({ summary: 'Get project upvotes' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: 200,
    description: 'List of upvotes',
    schema: {
      example: [
        {
          id: '323e4567-e89b-12d3-a456-426614174000',
          userId: '223e4567-e89b-12d3-a456-426614174000',
          user: {
            username: 'johndoe',
          },
          createdAt: '2024-01-15T10:00:00.000Z',
        },
      ],
    },
  })
  getProjectUpvotes(@Param('id') id: string) {
    return this.projectsService.getProjectUpvotes(id);
  }
}

