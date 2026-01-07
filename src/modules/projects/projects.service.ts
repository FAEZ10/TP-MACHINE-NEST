import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { DevProject } from './entities/dev-project.entity';
import { ProjectUpvote } from './entities/project-upvote.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(DevProject)
    private projectsRepository: Repository<DevProject>,
    @InjectRepository(ProjectUpvote)
    private upvotesRepository: Repository<ProjectUpvote>,
  ) {}

  async getPublicProjects(query: QueryProjectsDto) {
    const { search, category, page, limit, sortBy } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .where('project.isPublished = :isPublished', { isPublished: true });

    if (search) {
      queryBuilder.andWhere(
        '(project.name ILIKE :search OR project.tagline ILIKE :search OR project.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('project.category = :category', { category });
    }

    if (sortBy === 'popular' || sortBy === 'trending') {
      queryBuilder.orderBy('project.upvotesCount', 'DESC');
      if (sortBy === 'trending') {
        queryBuilder.andWhere('project.createdAt > :date', {
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        });
      }
    } else {
      queryBuilder.orderBy('project.createdAt', 'DESC');
    }

    const [projects, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPublicProjectById(id: string): Promise<DevProject> {
    const project = await this.projectsRepository.findOne({
      where: { id, isPublished: true },
      relations: ['user'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async getTrendingProjects() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return this.projectsRepository.find({
      where: { isPublished: true },
      order: { upvotesCount: 'DESC', createdAt: 'DESC' },
      take: 10,
      relations: ['user'],
    });
  }

  async getLatestProjects() {
    return this.projectsRepository.find({
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
      take: 10,
      relations: ['user'],
    });
  }

  async searchProjects(searchTerm: string) {
    return this.projectsRepository.find({
      where: [
        { name: ILike(`%${searchTerm}%`), isPublished: true },
        { tagline: ILike(`%${searchTerm}%`), isPublished: true },
        { description: ILike(`%${searchTerm}%`), isPublished: true },
      ],
      relations: ['user'],
      take: 20,
    });
  }

  async getProjectsByCategory(category: string) {
    return this.projectsRepository.find({
      where: { category: category as any, isPublished: true },
      relations: ['user'],
      order: { upvotesCount: 'DESC' },
    });
  }

  async getMyProjects(userId: string) {
    return this.projectsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createProject(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<DevProject> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      userId,
    });

    return this.projectsRepository.save(project);
  }

  async getProjectById(id: string, userId?: string): Promise<DevProject> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!project.isPublished && project.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  async updateProject(
    id: string,
    userId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<DevProject> {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You can only update your own projects');
    }

    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async deleteProject(id: string, userId: string): Promise<{ message: string }> {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    await this.projectsRepository.remove(project);
    return { message: 'Project deleted successfully' };
  }

  async publishProject(id: string, userId: string): Promise<DevProject> {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You can only publish your own projects');
    }

    project.isPublished = true;
    return this.projectsRepository.save(project);
  }

  async unpublishProject(id: string, userId: string): Promise<DevProject> {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You can only unpublish your own projects');
    }

    project.isPublished = false;
    return this.projectsRepository.save(project);
  }

  async upvoteProject(projectId: string, userId: string): Promise<{ message: string }> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!project.isPublished) {
      throw new ForbiddenException('Cannot upvote unpublished project');
    }

    const existingUpvote = await this.upvotesRepository.findOne({
      where: { projectId, userId },
    });

    if (existingUpvote) {
      throw new ConflictException('You have already upvoted this project');
    }

    const upvote = this.upvotesRepository.create({ projectId, userId });
    await this.upvotesRepository.save(upvote);

    project.upvotesCount += 1;
    await this.projectsRepository.save(project);

    return { message: 'Project upvoted successfully' };
  }

  async removeUpvote(projectId: string, userId: string): Promise<{ message: string }> {
    const upvote = await this.upvotesRepository.findOne({
      where: { projectId, userId },
    });

    if (!upvote) {
      throw new NotFoundException('Upvote not found');
    }

    await this.upvotesRepository.remove(upvote);

    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (project && project.upvotesCount > 0) {
      project.upvotesCount -= 1;
      await this.projectsRepository.save(project);
    }

    return { message: 'Upvote removed successfully' };
  }

  async getProjectUpvotes(projectId: string) {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const upvotes = await this.upvotesRepository.find({
      where: { projectId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return upvotes;
  }
}

