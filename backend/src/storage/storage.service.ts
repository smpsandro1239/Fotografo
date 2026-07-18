import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;
  private maxFileSize: number = 50 * 1024 * 1024; // 50MB
  private allowedMimeTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
  ];

  constructor(private configService: ConfigService) {
    const accountId = this.configService.get<string>('CLOUDFLARE_ACCOUNT_ID');
    const accessKeyId = this.configService.get<string>('CLOUDFLARE_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('CLOUDFLARE_SECRET_ACCESS_KEY');
    const customDomain = this.configService.get<string>('CLOUDFLARE_R2_CUSTOM_DOMAIN');

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new InternalServerErrorException('Cloudflare R2 configuration incomplete');
    }

    this.s3Client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region: 'auto',
    });

    this.bucketName = this.configService.get<string>('CLOUDFLARE_R2_BUCKET_NAME') || 'fotografo';
    this.publicUrl = customDomain ? `https://${customDomain}` : `https://pub-${this.bucketName}.r2.dev`;
  }

  private validateFile(file: Express.Multer.File): void {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} not allowed`);
    }
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File size exceeds ${this.maxFileSize / (1024 * 1024)}MB limit`);
    }
  }

  private generateKey(originalName: string, folder: string = 'uploads'): string {
    const ext = originalName.split('.').pop()?.toLowerCase() || 'bin';
    const uuid = randomUUID();
    const timestamp = Date.now();
    return `${folder}/${timestamp}-${uuid}.${ext}`;
  }

  async uploadFile(file: Express.Multer.File, folder?: string): Promise<{ key: string; url: string; publicUrl: string }> {
    this.validateFile(file);
    const key = this.generateKey(file.originalname, folder);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      throw new InternalServerErrorException(`Upload failed: ${error.message}`);
    }

    return {
      key,
      url: await this.getSignedUrl(key),
      publicUrl: `${this.publicUrl}/${key}`,
    };
  }

  async uploadBuffer(buffer: Buffer, fileName: string, mimeType: string, folder?: string): Promise<{ key: string; url: string; publicUrl: string }> {
    if (!this.allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(`File type ${mimeType} not allowed`);
    }
    if (buffer.length > this.maxFileSize) {
      throw new BadRequestException(`File size exceeds ${this.maxFileSize / (1024 * 1024)}MB limit`);
    }

    const key = this.generateKey(fileName, folder);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      throw new InternalServerErrorException(`Upload failed: ${error.message}`);
    }

    return {
      key,
      url: await this.getSignedUrl(key),
      publicUrl: `${this.publicUrl}/${key}`,
    };
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (expiresIn > 604800) { // Max 7 days
      expiresIn = 604800;
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async getUploadSignedUrl(key: string, mimeType: string, expiresIn: number = 3600): Promise<string> {
    if (!this.allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(`File type ${mimeType} not allowed`);
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: mimeType,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      throw new InternalServerErrorException(`Delete failed: ${error.message}`);
    }
  }

  async fileExists(key: string): Promise<boolean> {
    const command = new HeadObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  async getFileMetadata(key: string): Promise<{ contentType: string; contentLength: number; lastModified: Date } | null> {
    const command = new HeadObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const response = await this.s3Client.send(command);
      return {
        contentType: response.ContentType || 'application/octet-stream',
        contentLength: response.ContentLength || 0,
        lastModified: response.LastModified || new Date(),
      };
    } catch {
      return null;
    }
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }

  getBucketName(): string {
    return this.bucketName;
  }
}