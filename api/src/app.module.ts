import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [UserModule, ProductModule],
})
export class AppModule {}
