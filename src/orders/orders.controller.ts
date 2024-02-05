import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  HttpCode,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/users/decorators/user.decarator';
import {
  orderClickCompleteDto,
  orderClickPrepareDto,
} from './dto/orderClick.dto';
import { changeOrderStatusDto } from './dto/changeOrdeStatus.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  @Auth()
  @UsePipes(new ValidationPipe())
  createNow(
    @User('id') userId: number,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @Get('get-all')
  @Auth('admin')
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Post('prepare')
  @HttpCode(200)
  postOrderPrepare(@Body() body: orderClickPrepareDto) {
    return this.ordersService.orderClickPrepare(body);
  }

  @Post('complete')
  @HttpCode(200)
  postOrderComplete(@Body() body: orderClickCompleteDto) {
    return this.ordersService.orderClickComplete(body);
  }

  @Get('payment-verification/:id')
  paymentVerification(@Param() id: { id: string }) {
    return this.ordersService.paymentVerification(id);
  }
  @Put('status')
  @Auth('admin')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  changeOrderStatus(
    @User('isAdmin') requestUserId: number,
    @Body() body: changeOrderStatusDto,
  ) {
    return this.ordersService.changeOrderStatus(requestUserId, body);
  }

  @Delete(':id')
  @Auth()
  deleteOrder(@Param('id') orderId: string) {
    return this.ordersService.deleteOrder(orderId);
  }
}
