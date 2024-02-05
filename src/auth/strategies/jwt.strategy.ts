import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User as UserModel, PrismaClient } from '@prisma/client';
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ id }: Pick<UserModel, 'id'>) {
    const prisma = new PrismaClient();
    return await prisma.user.findUnique({ where: { id } });
  }
}
