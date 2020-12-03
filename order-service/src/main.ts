import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      retryAttempts: 5,
      retryDelay: 3000,
      host: process.env.ORDER_HOST || 'order',
      port: 4000,
    },
  });

  await app.startAllMicroservicesAsync();
  app.enableCors();
  await app.listen(4200);
}
bootstrap();
