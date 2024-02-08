import { BadRequestException, Injectable } from '@nestjs/common';
import { CardDto, CardUpdateDto } from './dto/card.dto';
import { PrismaService } from 'src/peisma sevice/prisma.service';
import { rm } from 'fs-extra';
import { path } from 'app-root-path';
import { cardSelect } from './dto/cardSelect';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}
  async cardAdd(dto: CardDto) {
    const addCard = await this.prisma.card.create({
      data: {
        createdAt: `${Date.now()}`,
        name: dto.name,
        description: dto.description,
        quantity: dto.quantity,
        wasQuantity: dto.quantity,
        price: dto.price,
        castPrice: dto.castPrice,
        imageLink: dto.imageLink,
        minOrderQuantity: dto.minOrderQuantity,
        type: dto.type,
        barcode: dto.barcode,
      },
      select: cardSelect,
    });
    return addCard;
  }

  async cardUpdate(
    {
      castPrice,
      description,
      name,
      price,
      quantity,
      type,
      minOrderQuantity,
    }: CardUpdateDto,
    { id }: { id: string },
  ) {
    const cardExist = await this.prisma.card.findUnique({ where: { id: +id } });
    if (!cardExist)
      throw new BadRequestException('Invitation with this id was not found');

    const update = await this.prisma.card.update({
      where: { id: +id },
      data: {
        name,
        description,
        quantity,
        castPrice,
        price,
        type,
        minOrderQuantity,
      },
      select: cardSelect,
    });

    return update;
  }

  async getCards() {
    return await this.prisma.card.findMany({ select: cardSelect });
  }
  async bestProducts() {
    return await this.prisma.card.findMany({
      select: cardSelect,
      orderBy: { orders: 'desc' },
      take: 8,
    });
  }
  async getCardsAdmin() {
    return await this.prisma.card.findMany();
  }
  async getCardsByTag(tag: string) {
    if (tag === 'all') return await this.getCards();
    return await this.prisma.card.findMany({
      where: { type: { search: tag } },
      select: cardSelect,
    });
  }

  async cardDelete(param: { id: string }) {
    const cardExist = await this.prisma.card.findUnique({
      where: { id: +param.id },
    });
    if (!cardExist) throw new BadRequestException('Card not found');
    const deleteCard = await this.prisma.card.delete({
      where: { id: +param.id },
    });
    await Promise.all(
      cardExist.imageLink.map(async (link) => {
        await rm(`${path}/${link}`);
      }),
    );
    return await this.getCards();
  }
  async searchCards(name: string) {
    const searchCard = await this.prisma.card.findMany({
      where: { name: { search: name } },
      select: cardSelect,
    });
    return searchCard;
  }

  async getById(paramId: { id: string }) {
    const getCard = await this.prisma.card.findUnique({
      where: { id: +paramId.id },
      select: cardSelect,
    });
    if (!getCard) throw new BadRequestException('Card not found');
    return getCard;
  }
}
