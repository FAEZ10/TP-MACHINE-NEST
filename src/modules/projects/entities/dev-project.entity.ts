import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ProjectCategory } from '../../../common/enums/project-category.enum';
import { ProjectStatus } from '../../../common/enums/project-status.enum';
import { User } from '../../users/entities/user.entity';
import { ProjectUpvote } from './project-upvote.entity';

@Entity('dev_projects')
export class DevProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  name: string;

  @Column()
  tagline: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  websiteUrl: string;

  @Column({ type: 'varchar', nullable: true })
  repositoryUrl: string;

  @Column({
    type: 'enum',
    enum: ProjectCategory,
    default: ProjectCategory.OTHER,
  })
  category: ProjectCategory;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.IN_DEVELOPMENT,
  })
  status: ProjectStatus;

  @Column('text', { array: true, default: [] })
  techStack: string[];

  @Column({ type: 'varchar', nullable: true })
  logoUrl: string;

  @Column('text', { array: true, default: [] })
  screenshotUrls: string[];

  @Column({ type: 'timestamp', nullable: true })
  launchedAt: Date;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: 0 })
  upvotesCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => ProjectUpvote, (upvote) => upvote.project)
  upvotes: ProjectUpvote[];
}

