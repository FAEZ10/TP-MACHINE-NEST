import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { NestjsTpRole } from '../../../common/enums/nestjs-tp-role.enum';
import { DevProject } from '../../projects/entities/dev-project.entity';
import { ProjectUpvote } from '../../projects/entities/project-upvote.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', nullable: true })
  websiteUrl: string;

  @Column({ type: 'varchar', nullable: true })
  githubUrl: string;

  @Column({ type: 'varchar', nullable: true })
  twitterUrl: string;

  @Column({
    type: 'enum',
    enum: NestjsTpRole,
    default: NestjsTpRole.USER,
  })
  role: NestjsTpRole;

  @Column({ type: 'timestamp', nullable: true })
  emailValidatedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  emailToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  emailTokenExpiry: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DevProject, (project) => project.user)
  projects: DevProject[];

  @OneToMany(() => ProjectUpvote, (upvote) => upvote.user)
  upvotes: ProjectUpvote[];
}

