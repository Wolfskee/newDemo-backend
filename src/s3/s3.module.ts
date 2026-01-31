import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { S3Service } from './s3.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: S3Client,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const region = config.getOrThrow<string>('AWS_REGION');
        const accessKeyId = config.getOrThrow<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = config.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        );
        const endpoint = config.get<string>('AWS_S3_ENDPOINT');

        const baseConfig: any = {
          region,
          credentials: { accessKeyId, secretAccessKey },
        };

        // If endpoint is set, assume LocalStack
        if (endpoint) {
          return new S3Client({
            ...baseConfig,
            endpoint,
            forcePathStyle: true,
          });
        }

        // No endpoint => real AWS S3
        return new S3Client(baseConfig);
      },
    },
    S3Service,
  ],
  exports: [S3Service],
})
export class S3Module {}
