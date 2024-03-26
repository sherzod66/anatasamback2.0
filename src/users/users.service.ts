import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma sevice/prisma.service';
import { selectResponse } from './dto/select.response';
import { UserUpdateDto } from './dto/userUpdate.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async profile(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: selectResponse,
    });
    return user;
  }

  async getAllUser() {
    const allUser = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return allUser;
  }
  async addUserName(id: number, addUserName: { name: string }) {
    const addName = await this.prisma.user.update({
      where: { id },
      data: { name: addUserName.name },
    });
    return addName;
  }
  async updateUser(param: { id: string }, body: UserUpdateDto) {
    const addName = await this.prisma.user.update({
      where: { id: +param.id },
      data: body,
    });
    return addName;
  }
}
