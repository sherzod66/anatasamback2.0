import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaService } from 'src/prisma sevice/prisma.service';

@Module({
  controllers: [CardsController],
  providers: [CardsService, PrismaService],
})
export class CardsModule {}
