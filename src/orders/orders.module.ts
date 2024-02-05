import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'src/peisma sevice/prisma.service';
import { SmsService } from 'src/sms service/sms.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, SmsService],
})
export class OrdersModule {}
