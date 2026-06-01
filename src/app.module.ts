import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { StorageModule } from './storage/storage.module';
import { UsersModule } from './users/users.module';

function getMongoUri(config: ConfigService) {
  const uri = (config.get<string>('MONGO_URI') ?? config.get<string>('MONGODB_URI') ?? '')
    .trim()
    .replace(/^['"]|['"]$/g, '');

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error(
      'Invalid MongoDB connection string. Set MONGO_URI to a value that starts with mongodb:// or mongodb+srv://',
    );
  }

  return uri;
}

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: getMongoUri(config),
      }),
    }),
    StorageModule,
    UsersModule,
    AuthModule,
    ProductsModule,
  ],
})
export class AppModule {}
