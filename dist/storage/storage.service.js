"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let StorageService = class StorageService {
    constructor(config) {
        this.config = config;
        this.bucketName = this.config.get('MINIO_BUCKET');
        this.publicUrl = this.config.get('MINIO_PUBLIC_URL');
        this.internalUrl = this.config.get('MINIO_INTERNAL_URL');
    }
    async onModuleInit() {
        if (!this.isConfigured())
            return;
        await this.ensureBucketReachable();
    }
    async ensureBucketReachable() {
        const response = await fetch(`${this.internalUrl}/${this.bucketName}/`, { method: 'GET' });
        if (![200, 403, 404].includes(response.status)) {
            throw new common_1.InternalServerErrorException('MinIO no disponible');
        }
    }
    async uploadProductImage(file) {
        if (!this.isConfigured()) {
            throw new common_1.InternalServerErrorException('Storage no configurado');
        }
        const extension = file.originalname.includes('.')
            ? file.originalname.split('.').pop()
            : 'jpg';
        const objectName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
        const uploadResponse = await fetch(`${this.internalUrl}/${this.bucketName}/${objectName}`, {
            method: 'PUT',
            body: new Uint8Array(file.buffer),
            headers: {
                'Content-Type': file.mimetype,
            },
        });
        if (!uploadResponse.ok) {
            throw new common_1.InternalServerErrorException('No se pudo subir la imagen');
        }
        return `${this.publicUrl}/${this.bucketName}/${objectName}`;
    }
    isConfigured() {
        return Boolean(this.bucketName && this.publicUrl && this.internalUrl);
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], StorageService);
//# sourceMappingURL=storage.service.js.map