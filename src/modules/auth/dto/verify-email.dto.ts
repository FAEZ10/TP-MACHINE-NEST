import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address to verify',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit verification token sent by email',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

