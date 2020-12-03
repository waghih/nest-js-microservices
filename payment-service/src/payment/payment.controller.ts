import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { OrderPaymentDetailsDto } from './dto/order-payment-details.dto';
import { PaymentService } from './payment.service';

@Controller('api/payment')
export class PaymentController {
  private logger = new Logger('PaymentController');

  constructor(private readonly service: PaymentService) {}

  @MessagePattern('initiatePayment')
  async initiatePayment(order: OrderPaymentDetailsDto): Promise<string> {
    return this.service.initiatePayment(order);
  }

  @EventPattern('paymentCancelled')
  async paymentCancelled(transactionId: string) {
    this.service.cancelPayment(transactionId);
  }
}
