import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma sevice/prisma.service';

@Injectable()
export class BasketService {
  constructor(private readonly prisma: PrismaService) {}
  async toggleBasket(cardId: { id: string }, userId: number) {
    const basketExist = await this.prisma.user.findUnique({
      where: { id: userId, basket: { some: { card: { id: +cardId.id } } } },
    });
    if (basketExist) {
      const { basket } = await this.prisma.user.update({
        where: { id: userId },
        data: {
          basket: { delete: { cardId_userId: { cardId: +cardId.id, userId } } },
        },
        select: { basket: { select: { card: true } } },
      });
      return basket.map((item) => ({ ...item.card }));
    } else {
      const { basket } = await this.prisma.user.update({
        where: { id: userId },
        data: {
          basket: {
            create: { card: { connect: { id: +cardId.id } } },
          },
        },
        select: { basket: { select: { card: true } } },
      });
      return basket.map((item) => ({ ...item.card }));
    }
  }

  async getBasket(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { basket: { select: { card: true } } },
    });
    return user.basket.map((item) => ({ ...item.card }));
  }
}
