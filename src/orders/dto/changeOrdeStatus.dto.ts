import { IsNumber, IsString } from 'class-validator';

export class changeOrderStatusDto {
  @IsNumber()
  id: number;
  @IsString()
  status: 'PENDING' | 'IN_PROGRESS' | 'CAN_BE_PICKED_UP' | 'TOOK';
}
