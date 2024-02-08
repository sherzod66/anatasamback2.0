import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  Param,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CardDto, CardUpdateDto } from './dto/card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}
  @Post('add')
  @Auth('admin')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  cardAdd(@Body() dto: CardDto) {
    return this.cardsService.cardAdd(dto);
  }
  @Put('update/:id')
  @Auth('admin')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  cardUpdate(@Body() dto: CardUpdateDto, @Param() id: { id: string }) {
    return this.cardsService.cardUpdate(dto, id);
  }

  @Get('get-cards')
  getCards() {
    return this.cardsService.getCards();
  }

  @Get('best-products')
  bestProducts() {
    return this.cardsService.bestProducts();
  }

  @Get('get-cards-by-tag/:tag')
  getCardsByTag(@Param('tag') tag: string) {
    return this.cardsService.getCardsByTag(tag);
  }
  @Get('get-cards-admin')
  @Auth('admin')
  getCardsAdmin() {
    return this.cardsService.getCardsAdmin();
  }

  @Get('get-by-id/:id')
  getById(@Param() paramId: { id: string }) {
    return this.cardsService.getById(paramId);
  }
  @Post('search')
  @HttpCode(200)
  searchCards(@Query('name') name: string) {
    return this.cardsService.searchCards(name);
  }

  @Delete('delete/:id')
  @Auth('admin')
  cardDelete(@Param() param: { id: string }) {
    return this.cardsService.cardDelete(param);
  }
}
