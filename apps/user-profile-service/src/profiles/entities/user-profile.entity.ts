import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * User profile stored by User Profile Service.
 * This service owns profile data, not passwords or login credentials.
 */
@Entity({ name: 'profiles', schema: 'profile_schema' })
export class UserProfile {
  /**
   * Unique profile ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Auth Service user ID.
   */
  @Index({ unique: true })
  @Column({ type: 'uuid' })
  userId!: string;

  /**
   * User email copied from the registration event.
   */
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  /**
   * User display name.
   */
  @Column({ type: 'varchar', length: 255 })
  fullName!: string;

  /**
   * User role copied for profile display or filtering.
   */
  @Column({ type: 'varchar', length: 50 })
  role!: string;

  /**
   * When this profile was created.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * When this profile was last updated.
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}
