import { IsNumber } from 'class-validator';

export class ToggleBasketDto {
  @IsNumber()
  cardId: number;
  @IsNumber()
  quantity: number;
}
