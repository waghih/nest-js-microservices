import { Injectable, Inject, Logger } from '@nestjs/common';
import { Order } from './order.entity';
import { OrderDto } from './dto/order.dto';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { OrderGateway } from './order.gateway';
import { OrderPaymentDetailsDto } from './dto/order-payment-details.dto';
import { PaymentDetailsDto } from './dto/payment-details.dto';
import { OrderStatus } from './enum/order-status.enum';
import { PaymentStatus } from './enum/payment-status.enum';

@Injectable()
export class OrderService {
  private readonly logger = new Logger('OrderService');

  private readonly paymentClient = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: process.env.PAYMENT_HOST || 'payment',
      port: 4001,
    },
  });

  constructor(
    @Inject('ORDER_SERVICE') private readonly orderModel: typeof Order,
    private readonly webSocket: OrderGateway,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderModel.findAll<Order>();
  }

  async findOne(id): Promise<Order> {
    return await this.orderModel.findOne({
      where: { id },
    });
  }

  async create(order: OrderDto): Promise<Order> {
    const newOrder = await this.orderModel.create<Order>({ ...order });
    this.webSocket.newOrderAdded(newOrder);
    return newOrder;
  }

  async findOneByStatus(status: string): Promise<Order> {
    return await this.orderModel.findOne<Order>({ where: { status } });
  }

  async initiatePayment(id: number) {
    const order = await this.orderModel.findOne({
      where: { id },
    });
    this.paymentClient
      .send('initiatePayment', new OrderPaymentDetailsDto(order))
      .subscribe(async (transactionId) => {
        await this.orderModel.update(
          { transactionId },
          { where: { id: order.id } },
        );
      });
  }

  async updatePaymentStatus(data: PaymentDetailsDto): Promise<Order> {
    const order = await this.orderModel.findOne({
      where: { id: data.orderId },
    });

    if (!order || order.status !== OrderStatus.Created) return;

    switch (data.status) {
      case PaymentStatus.Confirmed:
        order.status = OrderStatus.Confirmed;
        break;
      case PaymentStatus.Declined:
        order.status = OrderStatus.Cancelled;
        break;
      default:
        break;
    }
    this.webSocket.orderStatusUpdated(order);
    return await order.save();
  }

  async deliver(id: number) {
    setTimeout(async () => {
      const order = await this.orderModel.findOne({
        where: { id },
      });

      if (order.status !== OrderStatus.Confirmed)
        throw 'Unable to deliver due to wrong status';

      order.status = OrderStatus.Delivered;
      await order.save();
      this.webSocket.orderStatusUpdated(order);
    }, Math.floor(Math.random() * 2 + 1) * 6000);
  }

  async cancel(id: number): Promise<Order> {
    const order = await this.orderModel.findOne({
      where: { id },
    });

    switch (order.status) {
      case OrderStatus.Confirmed:
      case OrderStatus.Created:
        order.status = OrderStatus.Cancelled;
        this.paymentClient.emit('paymentCanceled', order.transactionId);
        this.webSocket.orderStatusUpdated(order);
        break;

      default:
        throw 'Cannot cancel due to wrong status';
    }
    return await order.save();
  }
}
