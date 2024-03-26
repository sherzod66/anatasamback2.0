import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateElectronicDto } from './dto/create-electronic.dto';
import { PrismaService } from 'src/prisma sevice/prisma.service';
import { rm } from 'fs-extra';
import { path } from 'app-root-path';

@Injectable()
export class ElectronicService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    { name, path, price, shelfLife }: CreateElectronicDto,
    userId: number,
  ) {
    const create = await this.prisma.electronic.create({
      data: {
        createdAt: `${Date.now()}`,
        name,
        path,
        price,
        shelfLife,
        User: { connect: { id: userId } },
      },
    });
    return create;
  }

  async findAll() {
    return await this.prisma.electronic.findMany();
  }
  async findById(id: number) {
    const searchElectronic = await this.prisma.electronic.findUnique({
      where: { id },
    });
    if (!searchElectronic)
      throw new BadRequestException('Electronic not found');
    return searchElectronic;
  }

  async remove(id: number) {
    const searchElectronic = await this.prisma.electronic.findUnique({
      where: { id },
    });
    if (!searchElectronic)
      throw new BadRequestException('Electronic not found');
    await this.prisma.electronic.delete({ where: { id: searchElectronic.id } });
    await rm(`${path}/${searchElectronic.path}`);
    return { status: 1, message: 'Electronic successfully deleted' };
  }
}
