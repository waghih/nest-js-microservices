import { Logger, Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { OrderPaymentDetailsDto } from './dto/order-payment-details.dto';
import { PaymentDetailsDto } from './dto/payment.dto';
import { PaymentStatus } from './enum/payment-status.enum';

const orderService = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: {
    host: process.env.ORDER_HOST || 'order',
    port: 4000,
  },
});

let cancelledPayments: string[] = [];

@Injectable()
export class PaymentService {
  private readonly logger = new Logger('Payment Service');

  initiatePayment(order: OrderPaymentDetailsDto): string {
    const payment = new PaymentDetailsDto(order.id);

    if (order.status !== 'created') throw 'Wrong order status';
    if (Math.random() * 10 >= 4) payment.status = PaymentStatus.Confirmed;

    setTimeout(async () => {
      if (
        cancelledPayments.find(
          (transactionId) => transactionId === payment.transactionId,
        )
      ) {
        cancelledPayments = cancelledPayments.filter(
          (transactionId) => transactionId === payment.transactionId,
        );
        return;
      }
      orderService.emit('paymentProcessed', payment).subscribe();
    }, Math.floor(Math.random() * 2 + 1) * 6000);

    return payment.transactionId;
  }

  cancelPayment(transactionId: string) {
    cancelledPayments.push(transactionId);
  }
}
