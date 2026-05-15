import {
  Body,
  Controller,
  Post,
  UploadedFile as NestUploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { UploadedMulterFile } from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { UploadKycDocumentDto } from './dto/upload-kyc-document.dto';

/**
 * Handles file upload requests.
 */
@Controller('files')
export class FileController {
  constructor(
    /**
     * Contains file upload business logic.
     */
    private readonly fileService: FileService,
  ) {}

  /**
   * Uploads a KYC document.
   * Request must use multipart/form-data with field name "file".
   */
  @Post('kyc-documents')
  @UseInterceptors(FileInterceptor('file'))
  async uploadKycDocument(
    @Body() dto: UploadKycDocumentDto,
    @NestUploadedFile() file: UploadedMulterFile,
  ) {
    return this.fileService.uploadKycDocument(dto, file);
  }
}
