import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { FileModule } from './files/file.module';
import { BasketModule } from './basket/basket.module';
import { OrdersModule } from './orders/orders.module';
import { ElectronicModule } from './electronic/electronic.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    UsersModule,
    CardsModule,
    FileModule,
    BasketModule,
    OrdersModule,
    ElectronicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
