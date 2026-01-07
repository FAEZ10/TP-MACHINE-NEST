import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { DevProject } from './entities/dev-project.entity';
import { ProjectUpvote } from './entities/project-upvote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DevProject, ProjectUpvote])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}

