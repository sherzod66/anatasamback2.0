import { IsBoolean, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsBoolean()
  isAdmin: boolean;
  @IsString()
  name: string;
  @IsString()
  phoneNumber: string;
}
