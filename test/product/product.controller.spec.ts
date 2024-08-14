import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductController } from 'src/modules/product/product.controller'; // Ajuste conforme necessário
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { ProductEntity } from 'src/modules/product/entity/product';
import { ProductInputCreateDto } from 'src/modules/product/product-input-create.dto';
import { ProductQuerystringDto } from 'src/modules/product/product-querystring.dto';

describe('ProductController', () => {
  let app: INestApplication;
  let service: InMemoryDBService<ProductEntity>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [InMemoryDBService],
    }).compile();

    app = moduleRef.createNestApplication();
    service = moduleRef.get<InMemoryDBService<ProductEntity>>(InMemoryDBService);
    await app.init();
  });

  it('should create a product', async () => {
    const productDto: ProductInputCreateDto = {
      name: 'Product 1',
      barcode: 12345,
    };

    const response = await request(app.getHttpServer())
      .post('/product')
      .send(productDto)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toEqual('Product 1');
    expect(response.body.barcode).toEqual(12345);
  });

  it('should update a product', async () => {
    const productDto: ProductInputCreateDto = {
      name: 'Updated Product',
      barcode: 12345,
    };

    const createdProduct = await service.create(productDto);

    const response = await request(app.getHttpServer())
      .put(`/product/${createdProduct.id}`)
      .send({ name: 'Updated Product Name' })
      .expect(200);

    expect(response.body.name).toEqual('Updated Product Name');
  });

  it('should delete a product', async () => {
    const productDto: ProductInputCreateDto = {
      name: 'Product to Delete',
      barcode: 67890,
    };

    const createdProduct = await service.create(productDto);

    await request(app.getHttpServer())
      .delete(`/product/${createdProduct.id}`)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get(`/product/${createdProduct.id}`)
      .expect(404);

    expect(response.body.message).toEqual('Produto não encontrado');
  });

  it('should list all products', async () => {
    await service.create({ name: 'Product 1', barcode: 123 });
    await service.create({ name: 'Product 2', barcode: 456 });

    const response = await request(app.getHttpServer())
      .get('/product')
      .expect(200);

    expect(response.body.length).toBeGreaterThan(1);
  });

  afterAll(async () => {
    await app.close();
  });
});
