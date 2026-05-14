import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * User account stored by Auth Service.
 * This entity only stores authentication-related data.
 */
@Entity({ name: 'users', schema: 'auth_schema' })
export class AuthUser {
  /**
   * Unique user ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Unique login email.
   */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  /**
   * User display name.
   */
  @Column({ type: 'varchar', length: 255 })
  fullName!: string;

  /**
   * Bcrypt hashed password.
   * Never store plaintext passwords.
   */
  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  /**
   * User role for authorization.
   */
  @Column({
    type: 'varchar',
    length: 50,
    default: 'USER',
  })
  role!: 'USER' | 'SUPPORT' | 'COMPLIANCE_OFFICER' | 'ADMIN';

  /**
   * Whether this auth account is active.
   */
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  /**
   * When the user was created.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * When the user was last updated.
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}
