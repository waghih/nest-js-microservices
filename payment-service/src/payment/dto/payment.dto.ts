import { PaymentStatus } from '../enum/payment-status.enum';

export class PaymentDetailsDto {
  constructor(orderId: number) {
    this.orderId = orderId;
    this.status = PaymentStatus.Declined;
    this.transactionId = Math.round(Math.random() * 999999).toString();
  }
  orderId: number;
  status: PaymentStatus;
  transactionId: string;
}
