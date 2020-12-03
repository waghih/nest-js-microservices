import { Order } from '../order.entity';

export class OrderPaymentDetailsDto {
  constructor(order: Order) {
    this.id = order.id;
    this.amountCents = order.amountCents;
    this.status = order.status;
    this.name = order.name;
  }
  id: number;
  amountCents: number;
  status: string;
  name: string;
}
