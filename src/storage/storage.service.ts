import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private readonly bucketName?: string;
  private readonly publicUrl?: string;
  private readonly s3Client?: S3Client;

  constructor(private readonly config: ConfigService) {
    this.bucketName =
      this.config.get<string>('S3_BUCKET') ??
      this.config.get<string>('AWS_S3_BUCKET_NAME') ??
      this.config.get<string>('BUCKET_NAME') ??
      this.config.get<string>('BUCKET') ??
      this.config.get<string>('MINIO_BUCKET');

    this.publicUrl =
      this.config.get<string>('S3_PUBLIC_URL') ??
      this.config.get<string>('AWS_S3_PUBLIC_URL') ??
      this.config.get<string>('MINIO_PUBLIC_URL');

    const endpoint =
      this.config.get<string>('S3_ENDPOINT') ??
      this.config.get<string>('AWS_ENDPOINT_URL') ??
      this.config.get<string>('ENDPOINT') ??
      this.config.get<string>('MINIO_INTERNAL_URL');
    const accessKeyId =
      this.config.get<string>('S3_ACCESS_KEY_ID') ??
      this.config.get<string>('AWS_ACCESS_KEY_ID') ??
      this.config.get<string>('ACCESS_KEY_ID') ??
      this.config.get<string>('MINIO_ACCESS_KEY');
    const secretAccessKey =
      this.config.get<string>('S3_SECRET_ACCESS_KEY') ??
      this.config.get<string>('AWS_SECRET_ACCESS_KEY') ??
      this.config.get<string>('SECRET_ACCESS_KEY') ??
      this.config.get<string>('MINIO_SECRET_KEY');

    if (endpoint && accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        endpoint,
        region: this.config.get<string>('S3_REGION') ?? this.config.get<string>('AWS_DEFAULT_REGION') ?? 'auto',
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        forcePathStyle: (this.config.get<string>('S3_FORCE_PATH_STYLE') ?? 'true') !== 'false',
      });
    }
  }

  uploadVehicleImage(file: Express.Multer.File) {
    return this.uploadFile(file, 'vehicles');
  }

  uploadProductImage(file: Express.Multer.File) {
    return this.uploadFile(file, 'products');
  }

  async getPublicUrl(key: string) {
    if (this.publicUrl) {
      return `${this.publicUrl.replace(/\/$/, '')}/${key}`;
    }

    if (!this.s3Client || !this.bucketName) {
      throw this.notConfiguredError();
    }

    return getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
      { expiresIn: 60 * 60 },
    );
  }

  async getPublicUrls(keys: string[]) {
    return Promise.all(keys.map((key) => this.getPublicUrl(key)));
  }

  private async uploadFile(file: Express.Multer.File, folder: string) {
    if (!this.s3Client || !this.bucketName) {
      throw this.notConfiguredError();
    }

    const extension = file.originalname.includes('.') ? file.originalname.split('.').pop() : 'jpg';
    const objectName = `${folder}/${randomUUID()}.${extension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return objectName;
  }

  private notConfiguredError() {
    return new ServiceUnavailableException(
      'Storage no configurado. Conecta Railway Bucket y define S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID y S3_SECRET_ACCESS_KEY.',
    );
  }
}
