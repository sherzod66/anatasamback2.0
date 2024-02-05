import { IsPhoneNumber, IsString } from 'class-validator';
export class authDto {
  @IsPhoneNumber()
  phoneNumber: string;
}
