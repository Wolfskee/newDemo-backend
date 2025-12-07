import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Converts string "CUSTOMER" → UserRole.CUSTOMER
      whitelist: true, // Strips unknown properties
    }),
  );

  const port = process.env.PORT ?? 8000;
  const host = process.env.HOST ?? '127.0.0.1';
  await app.listen(port, host);
}
bootstrap();
