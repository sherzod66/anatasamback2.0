import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma sevice/prisma.service';
import {
  orderClickCompleteDto,
  orderClickPrepareDto,
} from './dto/orderClick.dto';
import { TResult } from './order types/result.type';
import { v4 as uuidv4 } from 'uuid';
import { changeOrderStatusDto } from './dto/changeOrdeStatus.dto';
import { SmsService } from 'src/sms service/sms.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
  ) {}

  async getOrders() {
    return await this.prisma.order.findMany({
      where: { paidStatus: { not: 'PENDING' } },
      include: { invitationInfo: true },
      orderBy: { id: 'desc' },
    });
  }
  async createOrder(userId: number, orderDto: CreateOrderDto) {
    const { isAdmin } = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (isAdmin) {
      if (orderDto.basket) {
        Promise.all(
          orderDto.invitationInfo.map(async (item) => {
            await this.prisma.basket.delete({
              where: { cardId_userId: { cardId: item.cardId, userId } },
            });
          }),
        );
      }
      return await this.prismaCreate(
        userId,
        orderDto,
        orderDto.paid,
        'PAID',
        isAdmin,
      );
    } else {
      if (orderDto.basket) {
        Promise.all(
          orderDto.invitationInfo.map(async (item) => {
            await this.prisma.basket.delete({
              where: { cardId_userId: { cardId: item.cardId, userId } },
            });
          }),
        );
      }
      return await this.prismaCreate(
        userId,
        orderDto,
        orderDto.paid,
        'PENDING',
        isAdmin,
      );
    }
  }

  async prismaCreate(
    userId: number,
    orderDto: CreateOrderDto,
    paid: number,
    paidStatus: 'PAID' | 'PENDING',
    isAdmin: boolean,
  ) {
    const createOrder = await this.prisma.order.create({
      data: {
        createdAt: `${Date.now()}`,
        orderPrice: orderDto.orderPrice,
        paid: paid,
        userName: orderDto.userName,
        userPhone: orderDto.userPhone,
        paymentMethod: orderDto.paymentMethod,
        paidStatus,
        payment_id: uuidv4(),
        User: { connect: { id: userId } },
        invitationInfo: {
          createMany: {
            data: [...orderDto.invitationInfo],
          },
        },
      },
      include: { invitationInfo: true },
    });
    if (isAdmin)
      await Promise.all(
        orderDto.invitationInfo.map(
          async (item) =>
            await this.prisma.card.update({
              where: { id: item.cardId },
              data: {
                orders: { increment: 1 },
                quantity: { decrement: item.quantity },
              },
            }),
        ),
      );
    return createOrder;
  }

  async orderClickPrepare(body: orderClickPrepareDto) {
    const checkOrder = await this.prisma.order.findUnique({
      where: {
        id: +body.merchant_trans_id,
      },
    });

    if (!checkOrder)
      return {
        error: '-5',
        error_note: 'Order not found',
      };
    if (checkOrder.orderPrice !== +body.amount) {
      return {
        error: '-2',
        error_note: 'Incorrect parameter amount',
      };
    }
    const result: TResult = {
      ...body,
      merchant_prepare_id: `${body.merchant_trans_id}`,
      merchant_confirm_id: `${body.merchant_trans_id}`,
    };
    return result;
  }
  async orderClickComplete(body: orderClickCompleteDto) {
    const getCard = await this.prisma.order.findUnique({
      where: { id: +body.merchant_trans_id },
      include: { invitationInfo: true },
    });
    if (+body.error < 0 || +body.action === 0) {
      console.log('complete error');
      await Promise.all(
        getCard.invitationInfo.map(
          async (item) =>
            await this.prisma.card.update({
              where: { id: item.cardId },
              data: {
                orders: { decrement: 1 },
                quantity: { increment: item.quantity },
              },
            }),
        ),
      );
      const deleteInfo = await this.prisma.invitationInfo.deleteMany({
        where: {
          orderId: +body.merchant_trans_id,
        },
      });
      const deleteOrder = await this.prisma.order.delete({
        where: {
          id: +body.merchant_trans_id,
        },
      });
      return {
        error: '-9',
        error_note: 'Transaction cancelled',
      };
    }
    await Promise.all(
      getCard.invitationInfo.map(
        async (item) =>
          await this.prisma.card.update({
            where: { id: item.cardId },
            data: {
              orders: { increment: 1 },
              quantity: { decrement: item.quantity },
            },
          }),
      ),
    );
    const updatePaid = await this.prisma.order.update({
      where: { id: +body.merchant_trans_id },
      data: {
        paidStatus: 'PAID',
        paid: +body.amount,
        payment_id: body.click_paydoc_id,
      },
    });
    const result: TResult = {
      ...body,
      merchant_prepare_id: `${body.merchant_trans_id}`,
      merchant_confirm_id: `${body.merchant_trans_id}`,
    };
    return result;
  }
  async paymentVerification(path: { id: string }) {
    const searchOrder = await this.prisma.order.findUnique({
      where: {
        payment_id: path.id,
      },
    });
    if (!searchOrder)
      return {
        status: 'error',
        paymentStatus: -1,
        message: 'Payment was not made or payment was canceled',
      };
    return {
      status: 'success',
      paymentStatus: 0,
      message: 'Successfully paid!',
    };
  }

  async changeOrderStatus(requestUserId: number, body: changeOrderStatusDto) {
    const thisOrder = await this.prisma.order.findUnique({
      where: { id: body.id },
      include: { invitationInfo: true },
    });
    if (!thisOrder) throw new BadRequestException('Order not found');
    if (thisOrder.status === 'TOOK')
      return { status: -1, message: 'Order status cannot be changed' };
    const orderUser = await this.prisma.user.findUnique({
      where: { id: thisOrder.userId },
    });

    if (body.status === 'CAN_BE_PICKED_UP') {
      //TODO: Во ремемя деплоя упрать блок if(orderUser && orderUser.isAdmin === false) и просто отпралять смс и разкоментировать нижний try catch
      await this.prisma.order.update({
        where: { id: body.id },
        data: { status: body.status },
      });
      try {
        await this.smsService.sendSms(
          thisOrder.userPhone,
          this.getMessageForSms(thisOrder.invitationInfo[0].luckyOnes),
        );
      } catch (e) {
        return await this.smsService.errorHandler(
          thisOrder.userPhone,
          this.getMessageForSms(thisOrder.invitationInfo[0].luckyOnes),
        );
      }
      return { status: 1, message: 'Order status changed successfully' };
    }

    if (body.status === 'TOOK') {
      if (orderUser.isAdmin) {
        let paidSum = thisOrder.orderPrice - thisOrder.paid;
        await this.prisma.order.update({
          where: { id: body.id },
          data: { status: body.status, paid: { increment: paidSum } },
        });
        return { status: 1, message: 'Order status changed successfully' };
      }
      await this.prisma.order.update({
        where: { id: body.id },
        data: { status: body.status },
      });
      return { status: 1, message: 'Order status changed successfully' };
    }

    await this.prisma.order.update({
      where: { id: body.id },
      data: { status: body.status },
    });
    return { status: 1, message: 'Order status changed successfully' };
  }

  async deleteOrder(orderId: string) {
    const findOrder = await this.prisma.order.findUnique({
      where: { id: +orderId },
      include: { invitationInfo: true },
    });
    if (!findOrder) throw new BadRequestException('Order not found');
    if (findOrder.status === 'PENDING') {
      await Promise.all(
        findOrder.invitationInfo.map(async (card) => {
          await this.prisma.card.update({
            where: { id: card.cardId },
            data: {
              orders: { decrement: 1 },
              quantity: { increment: card.quantity },
            },
          });
          await this.prisma.invitationInfo.deleteMany({
            where: { id: card.id },
          });
        }),
      );
      await this.prisma.order.delete({ where: { id: findOrder.id } });
      return { status: 1, message: 'The order was successfully deleted' };
    }
    return { status: -1, message: 'The order cannot be deleted' };
  }

  getMessageForSms(orderId: string): string {
    return `anatasam.uz: Заказанные вами пригласительные ${orderId} готовы и ожидают вас.
    Siz buyurtma qilgan taklifnomalar ${orderId}  tayyor va sizni kutmoqda
    Samarqand shahri, Amir Temur ko‘chasi, 36-uy
    Instagram: https://clck.ru/39fnv3`;
  }
}
/*
paymentStatus:
-1 оплата не прошла или оплата была отменена
0 успешно оплачено
*/
