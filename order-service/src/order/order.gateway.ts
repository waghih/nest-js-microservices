import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Order } from './order.entity';

@WebSocketGateway()
export class OrderGateway {
  private readonly logger = new Logger('Order Gateway');

  @WebSocketServer()
  webSocketServer: Server;

  newOrderAdded(payload: Order): void {
    this.webSocketServer.emit('newOrderAdded', payload);
  }

  orderStatusUpdated(payload: Order): void {
    this.webSocketServer.emit('orderStatusUpdated', payload);
  }
}
