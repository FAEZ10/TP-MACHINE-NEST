import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums/user-role.enum';

export class UpdateRoleDto {
  @ApiProperty({
    example: UserRole.ADMIN,
    enum: UserRole,
    description: 'New role for the user',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

