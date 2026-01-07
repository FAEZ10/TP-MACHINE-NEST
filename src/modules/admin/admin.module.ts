import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { DevProject } from '../projects/entities/dev-project.entity';
import { ProjectUpvote } from '../projects/entities/project-upvote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, DevProject, ProjectUpvote])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

