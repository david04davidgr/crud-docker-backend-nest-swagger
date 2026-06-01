import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly bucketName?: string;
  private readonly publicUrl?: string;
  private readonly internalUrl?: string;

  constructor(private readonly config: ConfigService) {
    this.bucketName = this.config.get<string>('MINIO_BUCKET');
    this.publicUrl = this.config.get<string>('MINIO_PUBLIC_URL');
    this.internalUrl = this.config.get<string>('MINIO_INTERNAL_URL');
  }

  uploadVehicleImage(file: Express.Multer.File) {
    return this.uploadFile(file, 'vehicles');
  }

  uploadProductImage(file: Express.Multer.File) {
    return this.uploadFile(file, 'products');
  }

  private async uploadFile(file: Express.Multer.File, folder: string) {
    if (!this.isConfigured()) {
      throw new InternalServerErrorException('Storage no configurado');
    }

    const extension = file.originalname.includes('.')
      ? file.originalname.split('.').pop()
      : 'jpg';
    const objectName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    const uploadResponse = await fetch(`${this.internalUrl}/${this.bucketName}/${objectName}`, {
      method: 'PUT',
      body: new Uint8Array(file.buffer),      
      headers: {
        'Content-Type': file.mimetype,
      },
    });

    if (!uploadResponse.ok) {
      throw new InternalServerErrorException('No se pudo subir la imagen');
    }

    return `${this.publicUrl}/${this.bucketName}/${objectName}`;
  }

  private isConfigured() {
    return Boolean(this.bucketName && this.publicUrl && this.internalUrl);
  }
}
