import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { ApiProperty } from '@nestjs/swagger';

export class ProductEntity implements InMemoryDBEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: Number })
  price: number;

  @ApiProperty({ type: Number })
  barcode: number;
}
