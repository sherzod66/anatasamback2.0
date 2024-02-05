import { Controller, Get, Post, Param, HttpCode } from '@nestjs/common';
import { BasketService } from './basket.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/users/decorators/user.decarator';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post('toggle-basket/:id')
  @Auth()
  @HttpCode(200)
  toggleBasket(@Param() cardId: { id: string }, @User('id') userId: number) {
    return this.basketService.toggleBasket(cardId, userId);
  }
  @Get()
  @Auth()
  getBasket(@User('id') userId: number) {
    return this.basketService.getBasket(userId);
  }
}
