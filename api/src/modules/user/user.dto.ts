import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  mail: string;

  @ApiProperty()
  name: string;
}
