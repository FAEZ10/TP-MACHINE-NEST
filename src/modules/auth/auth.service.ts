import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Verify2FADto } from './dto/verify-2fa.dto';
import { MailService } from '../mail/mail.service';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password, username, firstName, lastName } = registerDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = this.generateRandomCode();
    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setHours(verificationCodeExpiry.getHours() + 24);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
      verificationCode,
      verificationCodeExpiry,
    });

    await this.usersRepository.save(user);
    await this.mailService.sendVerificationEmail(email, verificationCode, firstName);

    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ message: string }> {
    const { email, token } = verifyEmailDto;

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerifiedAt) {
      throw new BadRequestException('Email already verified');
    }

    if (user.verificationCode !== token) {
      throw new BadRequestException('Invalid verification token');
    }

    if (!user.verificationCodeExpiry || new Date() > user.verificationCodeExpiry) {
      throw new BadRequestException('Verification token expired');
    }

    user.emailVerifiedAt = new Date();
    user.verificationCode = null;
    user.verificationCodeExpiry = null;

    await this.usersRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async login(loginDto: LoginDto): Promise<{ message: string }> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const code = this.generateRandomCode();
    const codeExpiry = new Date();
    codeExpiry.setMinutes(codeExpiry.getMinutes() + 10);

    user.verificationCode = code;
    user.verificationCodeExpiry = codeExpiry;

    await this.usersRepository.save(user);
    await this.mailService.send2FACode(email, code, user.firstName);

    return { message: '2FA code sent to your email' };
  }

  async verify2FA(verify2FADto: Verify2FADto): Promise<{ accessToken: string }> {
    const { email, code } = verify2FADto;

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.verificationCode !== code) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    if (!user.verificationCodeExpiry || new Date() > user.verificationCodeExpiry) {
      throw new UnauthorizedException('2FA code expired');
    }

    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await this.usersRepository.save(user);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
      
    }

    if (user.emailVerifiedAt) {
      throw new BadRequestException('Email already verified');
    }

    const verificationCode = this.generateRandomCode();
    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setHours(verificationCodeExpiry.getHours() + 24);

    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;

    await this.usersRepository.save(user);
    await this.mailService.sendVerificationEmail(email, verificationCode, user.firstName);

    return { message: 'Verification email sent' };
  }

  async resend2FACode(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const code = this.generateRandomCode();
    const codeExpiry = new Date();
    codeExpiry.setMinutes(codeExpiry.getMinutes() + 10);

    user.verificationCode = code;
    user.verificationCodeExpiry = codeExpiry;

    await this.usersRepository.save(user);
    await this.mailService.send2FACode(email, code, user.firstName);

    return { message: '2FA code sent' };
  }

  private generateRandomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

