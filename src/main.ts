import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma sevice/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(4000);
}
bootstrap();
