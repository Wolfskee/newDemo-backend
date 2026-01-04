import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

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
}
