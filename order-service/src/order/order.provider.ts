import { Order } from './order.entity';

export const orderProvider = [
  {
    provide: 'ORDER_SERVICE',
    useValue: Order,
  },
];
