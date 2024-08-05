import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

@Module({
  controllers: [ProductController],
  imports: [InMemoryDBModule.forFeature('product')],
})
export class ProductModule {}
