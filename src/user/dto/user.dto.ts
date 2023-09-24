import { IsNumber, IsString } from 'class-validator';

export class UserDTO {
  @IsNumber()
  earnings: number;

  @IsString()
  name: string;

  @IsString()
  country: string;
}
