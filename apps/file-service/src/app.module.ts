import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, AppHealthModule } from '@app/common';
import { createTypeOrmOptions } from '@app/database';
import { UploadedFile } from './files/entities/uploaded-file.entity';
import { FileModule } from './files/file.module';

/**
 * Root module for File Service.
 */
@Module({
  imports: [
    AppConfigModule,
    AppHealthModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(configService, [UploadedFile], 'file_schema'),
    }),
    FileModule,
  ],
})
export class AppModule {}
