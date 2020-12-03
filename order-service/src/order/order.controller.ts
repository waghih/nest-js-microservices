import {
  Controller,
  Post,
  Body,
  Logger,
  Inject,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order as OrderEntity } from './order.entity';
import { OrderDto } from './dto/order.dto';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { PaymentDetailsDto } from './dto/payment-details.dto';
import { OrderStatus } from './enum/order-status.enum';
import { Observable, from } from 'rxjs';

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger('OrderController');

  constructor(
    @Inject('ORDER_CLIENT') private readonly client: ClientProxy,
    private readonly service: OrderService,
  ) {}

  @Get()
  index(): Observable<OrderEntity[]> {
    return from(this.service.findAll());
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<OrderEntity> {
    const order = await this.service.findOne(id);

    if (!order) {
      throw new NotFoundException("This Order doesn't exist");
    }

    return order;
  }

  @Post()
  async create(@Body() order: OrderDto): Promise<OrderEntity> {
    const newOrder = await this.service.create(order);
    this.client.emit('orderCreated', newOrder.id);
    return newOrder;
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: number) {
    return await this.service.cancel(id);
  }

  @EventPattern('orderCreated')
  async orderCreated(id: number) {
    console.log('order service', this.service);
    await this.service.initiatePayment(id);
  }

  @EventPattern('paymentProcessed')
  async paymentProcessed(data: PaymentDetailsDto) {
    const order = await this.service.updatePaymentStatus(data);

    if (order && order.status === OrderStatus.Confirmed)
      this.client.emit('orderConfirmed', order.id);
  }

  @EventPattern('orderConfirmed')
  async orderConfirmed(id: number) {
    await this.service.deliver(id);
  }
}
