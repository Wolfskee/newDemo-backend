import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  constructor(private readonly s3: S3Client) {}

  async putObject(params: PutObjectCommand['input']) {
    const command = new PutObjectCommand(params);
    return this.s3.send(command);
  }

  async deleteObject(params: DeleteObjectCommand['input']) {
    const command = new DeleteObjectCommand(params);
    return this.s3.send(command);
  }

  async getPresignedGetUrl(
    params: GetObjectCommand['input'],
    expiresIn = 900, // 15 minutes
  ) {
    const command = new GetObjectCommand(params);
    return getSignedUrl(this.s3, command, { expiresIn });
  }
}
