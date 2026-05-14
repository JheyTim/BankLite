import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AuthUser } from '../users/entities/auth-user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthPublisher } from './auth.publisher';

/**
 * Contains authentication business logic.
 */
@Injectable()
export class AuthService {
  constructor(
    /**
     * Repository for Auth Service users.
     */
    @InjectRepository(AuthUser)
    private readonly usersRepository: Repository<AuthUser>,

    /**
     * Used to sign JWT access tokens.
     */
    private readonly jwtService: JwtService,

    /**
     * Publishes auth events to RabbitMQ.
     */
    private readonly authPublisher: AuthPublisher,
  ) {}

  /**
   * Registers a new user.
   */
  async register(dto: RegisterDto) {
    /**
     * Normalize email so duplicate checks are consistent.
     */
    const email = dto.email.toLowerCase().trim();

    /**
     * Check whether this email is already registered.
     */
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    /**
     * Hash the password before saving it.
     * The number 12 is the bcrypt salt rounds.
     */
    const passwordHash = await bcrypt.hash(dto.password, 12);

    /**
     * Create the Auth Service user record.
     */
    const user = this.usersRepository.create({
      email,
      fullName: dto.fullName,
      passwordHash,
      role: dto.role ?? 'USER',
    });

    /**
     * Save the user to PostgreSQL.
     */
    const savedUser = await this.usersRepository.save(user);

    /**
     * Event metadata used for tracing and idempotency.
     */
    const eventId = uuidv4();
    const correlationId = uuidv4();

    /**
     * Notify other services that a user was registered.
     */
    await this.authPublisher.publishUserRegistered({
      userId: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName,
      role: savedUser.role,
      eventId,
      correlationId,
      createdAt: savedUser.createdAt.toISOString(),
    });

    return {
      id: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
    };
  }

  /**
   * Logs in a user and returns a JWT access token.
   */
  async login(dto: LoginDto) {
    /**
     * Normalize email before searching.
     */
    const email = dto.email.toLowerCase().trim();

    /**
     * Find the user by email.
     */
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid login credentials.');
    }

    /**
     * Compare plaintext password with stored bcrypt hash.
     */
    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid login credentials.');
    }

    /**
     * JWT payload.
     * sub is the standard JWT subject field.
     */
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    /**
     * Sign and return the access token.
     */
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
