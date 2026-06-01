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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const storage_service_1 = require("../storage/storage.service");
const product_schema_1 = require("./schemas/product.schema");
let ProductsService = class ProductsService {
    constructor(productModel, storageService) {
        this.productModel = productModel;
        this.storageService = storageService;
    }
    create(dto) {
        return this.productModel.create(dto);
    }
    findAll() {
        return this.productModel.find().sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const product = await this.productModel.findById(id).exec();
        if (!product)
            throw new common_1.NotFoundException('Producto no encontrado');
        return product;
    }
    async update(id, dto) {
        const product = await this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
        if (!product)
            throw new common_1.NotFoundException('Producto no encontrado');
        return product;
    }
    async addImage(id, file) {
        const product = await this.findOne(id);
        const imageUrl = await this.storageService.uploadProductImage(file);
        product.images.push(imageUrl);
        await product.save();
        return product;
    }
    async remove(id) {
        const product = await this.productModel.findByIdAndDelete(id).exec();
        if (!product)
            throw new common_1.NotFoundException('Producto no encontrado');
        return { message: 'Producto eliminado' };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        storage_service_1.StorageService])
], ProductsService);
//# sourceMappingURL=products.service.js.map