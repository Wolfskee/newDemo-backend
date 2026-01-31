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
        const endpoint = config.get<string>('AWS_S3_ENDPOINT');
        const accessKeyId = config.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = config.get<string>('AWS_SECRET_ACCESS_KEY');

        const s3Config: any = {
          region,
        };

        // 只有当 endpoint 存在且不为空时，才设置 endpoint（LocalStack）
        if (endpoint) {
          s3Config.endpoint = endpoint;
          s3Config.forcePathStyle = true;
        }

        // 只有当 accessKeyId 和 secretAccessKey 都存在时，才设置 credentials
        // 生产环境 EC2 会自动通过 IAM Role 获取，不需要显式设置 credentials
        if (accessKeyId && secretAccessKey) {
          s3Config.credentials = {
            accessKeyId,
            secretAccessKey,
          };
        }

        return new S3Client(s3Config);
      },
    },
    S3Service,
  ],
  exports: [S3Service],
})
export class S3Module {}
