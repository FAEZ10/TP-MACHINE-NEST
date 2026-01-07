import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { DevProject } from '../projects/entities/dev-project.entity';
import { ProjectUpvote } from '../projects/entities/project-upvote.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(DevProject)
    private projectsRepository: Repository<DevProject>,
    @InjectRepository(ProjectUpvote)
    private upvotesRepository: Repository<ProjectUpvote>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['projects'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserRole(id: string, updateRoleDto: UpdateRoleDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = updateRoleDto.role;
    return this.usersRepository.save(user);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  async getAllProjects() {
    return this.projectsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getProjectsByUser(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.projectsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteProject(id: string): Promise<{ message: string }> {
    const result = await this.projectsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Project not found');
    }

    return { message: 'Project deleted successfully' };
  }

  async moderateProject(id: string): Promise<DevProject> {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.isPublished = false;
    return this.projectsRepository.save(project);
  }

  async getStats() {
    const totalUsers = await this.usersRepository.count();
    const totalProjects = await this.projectsRepository.count();
    const publishedProjects = await this.projectsRepository.count({
      where: { isPublished: true },
    });
    const totalUpvotes = await this.upvotesRepository.count();

    const recentUsers = await this.usersRepository.count({
      where: {
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) as any,
      },
    });

    return {
      totalUsers,
      totalProjects,
      publishedProjects,
      totalUpvotes,
      recentUsers,
    };
  }

  async getTrendingTech() {
    const projects = await this.projectsRepository.find({
      where: { isPublished: true },
      select: ['techStack'],
    });

    const techCount: Record<string, number> = {};

    projects.forEach((project) => {
      project.techStack.forEach((tech) => {
        techCount[tech] = (techCount[tech] || 0) + 1;
      });
    });

    const sortedTech = Object.entries(techCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name, count]) => ({ name, count }));

    return sortedTech;
  }
}

