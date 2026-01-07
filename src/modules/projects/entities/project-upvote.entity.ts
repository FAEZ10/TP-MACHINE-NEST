import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { DevProject } from './dev-project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('project_upvotes')
@Unique(['projectId', 'userId'])
export class ProjectUpvote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => DevProject, (project) => project.upvotes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: DevProject;

  @ManyToOne(() => User, (user) => user.upvotes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}

