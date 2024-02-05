import { IsArray, IsNumber, IsString } from 'class-validator';

export class CardDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  quantity: number;
  @IsNumber()
  castPrice: number;
  @IsNumber()
  minOrderQuantity: number;
  @IsNumber()
  price: number;
  @IsString()
  type: string;
  @IsString()
  barcode: string;
  @IsArray()
  imageLink: string[];
}
export class CardUpdateDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  quantity: number;
  @IsNumber()
  castPrice: number;
  @IsNumber()
  price: number;
  @IsString()
  type: string;
  @IsNumber()
  minOrderQuantity: number;
}
