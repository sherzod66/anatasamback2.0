import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

class invitationInfoDTO {
  cardId: number;
  cardPrice: number;
  cardImage: string[];
  luckyOnes: string;
  family: string;
  lang: 'RU' | 'UZ' | 'EN';
  restaurant: string;
  time: string;
  date: string;
  quantity: number;
  comment: string;
}

export class CreateOrderDto {
  @IsString()
  paymentMethod: 'UZCARD' | 'HUMO' | 'CASH';
  @IsNumber()
  paid: number;
  @IsNumber()
  orderPrice: number;
  @IsString()
  userName: string;
  @IsString()
  userPhone: string;
  @IsArray()
  invitationInfo: invitationInfoDTO[];
  @IsBoolean()
  basket: boolean;
}
