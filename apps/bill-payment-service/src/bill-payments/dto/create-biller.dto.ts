import { IsIn, IsString, MinLength } from 'class-validator';

/**
 * Request body for creating a biller.
 */
export class CreateBillerDto {
  /**
   * Human-readable biller name.
   */
  @IsString()
  @MinLength(2)
  name!: string;

  /**
   * Biller category.
   */
  @IsIn(['ELECTRICITY', 'WATER', 'INTERNET', 'MOBILE', 'GOVERNMENT', 'OTHER'])
  category!:
    | 'ELECTRICITY'
    | 'WATER'
    | 'INTERNET'
    | 'MOBILE'
    | 'GOVERNMENT'
    | 'OTHER';
}
