import { Module } from '@nestjs/common';
import { ElectronicService } from './electronic.service';
import { ElectronicController } from './electronic.controller';
import { PrismaService } from 'src/prisma sevice/prisma.service';

@Module({
  controllers: [ElectronicController],
  providers: [ElectronicService, PrismaService],
})
export class ElectronicModule {}
