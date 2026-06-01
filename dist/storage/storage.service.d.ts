import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class StorageService implements OnModuleInit {
    private readonly config;
    private readonly bucketName?;
    private readonly publicUrl?;
    private readonly internalUrl?;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    private ensureBucketReachable;
    uploadProductImage(file: Express.Multer.File): Promise<string>;
    private isConfigured;
}
