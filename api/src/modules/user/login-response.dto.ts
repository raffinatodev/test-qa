import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty()
  token: string;
}
