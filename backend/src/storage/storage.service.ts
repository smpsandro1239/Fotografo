import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    // Leitura defensiva das credenciais R2 — falha cedo com mensagem clara
    const readEnv = (name: string): string => {
      const value = this.configService.get<string>(name);
      if (!value) {
        this.logger.warn(`Variável de ambiente em falta: ${name}`);
      }
      return value ?? '';
    };

    const accountId = readEnv('CLOUDFLARE_ACCOUNT_ID');
    const accessKeyId = readEnv('CLOUDFLARE_ACCESS_KEY_ID');
    const secretAccessKey = readEnv('CLOUDFLARE_SECRET_ACCESS_KEY');

    this.s3Client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region: 'auto',
    });

    this.bucketName = readEnv('CLOUDFLARE_R2_BUCKET_NAME');
  }

  async uploadFile(file: Express.Multer.File, key: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    return `https://pub-${this.bucketName}.r2.dev/${key}`; // Public URL if bucket is public, or custom domain
  }

  async getSignedUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}
