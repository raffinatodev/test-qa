import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { delayRequest } from '../common/dalay-request';
import { PrivateGuard } from '../common/guard';
import { ProductEntity } from './entity/product';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { ProductInputCreateDto } from './product-input-create.dto';
import { ProductQuerystringDto } from './product-querystring.dto';

@Controller('product')
@ApiTags('product')
@UseGuards(PrivateGuard)
@ApiBearerAuth()
export class ProductController {
  public constructor(
    private productService: InMemoryDBService<ProductEntity>,
  ) {}

  @Get('')
  @ApiResponse({
    type: ProductEntity,
    isArray: true,
    status: HttpStatus.OK,
  })
  public async findAll(
    @Query() params: ProductQuerystringDto,
  ): Promise<ProductEntity[]> {
    return delayRequest(async () => {
      let products = this.productService.getAll();

      if (params.barcode) {
        products = products.filter(
          ({ barcode }) => Number.parseInt(params.barcode) == barcode,
        );
      }

      if (params.name) {
        products = products.filter(({ name }) => params.name == name);
      }

      return products;
    });
  }

  @Get(':id')
  @ApiResponse({
    type: ProductEntity,
    status: HttpStatus.OK,
  })
  public async findOne(
    @Param('id') productId: string,
  ): Promise<ProductEntity[]> {
    return delayRequest(async () => {
      const product = this.productService.get(productId);

      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }

      return product;
    });
  }

  @Post('')
  @ApiResponse({
    type: ProductEntity,
    status: HttpStatus.OK,
  })
  public async create(
    @Body() input: ProductInputCreateDto,
  ): Promise<ProductEntity[]> {
    return delayRequest(async () => {
      const find = this.productService
        .getAll()
        .find(({ barcode }) => barcode === input.barcode);

      if (find) {
        throw new BadRequestException(
          'Já existe um produto com código de barras',
        );
      }

      return this.productService.create(input);
    });
  }

  @Put(':id')
  @ApiResponse({
    type: ProductEntity,
    status: HttpStatus.OK,
  })
  public async update(
    @Body() input: ProductInputCreateDto,
    @Param('id') productId: string,
  ): Promise<ProductEntity[]> {
    return delayRequest(async () => {
      const current = this.productService.get(productId);

      if (!current) {
        throw new NotFoundException('Produto não encontrado');
      }

      const find = this.productService
        .getAll()
        .find(
          ({ barcode, id }) => barcode === input.barcode && id !== productId,
        );

      if (find) {
        throw new BadRequestException(
          'Já existe um produto com este código de barras',
        );
      }

      const product = {
        id: productId,
        ...input,
      };
      this.productService.update(product);
      return product;
    });
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  public async delete(
    @Param('id') productId: string,
  ): Promise<ProductEntity[]> {
    return delayRequest(async () => {
      const product = this.productService.get(productId);

      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }

      this.productService.delete(productId);
    });
  }
}
