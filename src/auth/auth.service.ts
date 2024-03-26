import { BadRequestException, Injectable } from '@nestjs/common';

import { authDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma sevice/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SmsService } from 'src/sms service/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
  ) {}

  async auth({ phoneNumber }: authDto) {
    const searchUser = await this.prisma.user.findUnique({
      where: {
        phoneNumber,
      },
    });
    if (searchUser) {
      const secretKey = +this.generateKey();
      const addKey = await this.prisma.user.update({
        where: {
          id: searchUser.id,
        },
        data: {
          activateKey: secretKey,
        },
      });
      try {
        await this.smsService.sendSms(
          phoneNumber,
          this.getMessageForSms(secretKey),
        );
        return { response: 'activation key sent' };
      } catch (e) {
        return await this.smsService.errorHandler(phoneNumber, '');
      }
    } else {
      const secretKey = +this.generateKey();
      const addUser = await this.prisma.user.create({
        data: { phoneNumber, activateKey: secretKey },
      });
      try {
        await this.smsService.sendSms(
          phoneNumber,
          this.getMessageForSms(secretKey),
        );
        return { response: 'activation key sent' };
      } catch (e) {
        return await this.smsService.errorHandler(
          phoneNumber,
          this.getMessageForSms(secretKey),
        );
      }
    }
  }
  async confirmationNumber({ key }: { key: string }) {
    const isKey = await this.prisma.user.findUnique({
      where: { activateKey: +key },
    });
    if (!isKey) throw new BadRequestException('Invalid key');
    const token = await this.generateToken(isKey.id, isKey.phoneNumber);
    return { ...isKey, ...token };
  }

  generateKey() {
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const milliseconds = new Date().getMilliseconds();
    const key = `${hours}${minutes}${milliseconds}`;
    const generateNum = `${Math.round(Math.random() * +key)}`;
    if (generateNum.length < 6) {
      const num = `${Math.round(Math.random() * 9)}`;
      const endNum = generateNum + num;
      return endNum;
    } else {
      const endNum = generateNum.slice(0, 6);
      return endNum;
    }
  }
  async generateToken(id: number, phoneNumber: string) {
    const payload = {
      id,
      phoneNumber,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
      }),
    };
  }
  getMessageForSms(secretKey: number): string {
    return `anatasam.uz: Воспользуйтесь кодом верефикации, указанным ниже, для входа: ${secretKey}. Tizimga kirish uchun quyidagi tasdiqlash kodidan foydalaning ${secretKey}`;
  }
}
