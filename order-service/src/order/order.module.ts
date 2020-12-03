import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { orderProvider } from './order.provider';
import { OrderGateway } from './order.gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_CLIENT',
        transport: Transport.TCP,
        options: {
          host: process.env.ORDER_HOST || 'order',
          port: 4000,
        },
      },
    ]),
  ],
  providers: [OrderService, OrderGateway, ...orderProvider],
  controllers: [OrderController],
})
export class OrderModule {}
