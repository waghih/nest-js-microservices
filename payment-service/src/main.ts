import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

const microserviceConfig = {
  transport: Transport.TCP,
  options: {
    host: process.env.PAYMENT_HOST || 'payment',
    port: 4001,
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceConfig,
  );
  app.listen(() => {
    logger.log('Payment service is listening...');
  });
}
bootstrap();
