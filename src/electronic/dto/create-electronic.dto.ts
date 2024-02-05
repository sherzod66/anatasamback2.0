import { IsNumber, IsString } from 'class-validator';

export class CreateElectronicDto {
  @IsString()
  name: string;
  @IsString()
  path: string;
  @IsNumber()
  price: number;
  @IsString()
  shelfLife: string;
}
