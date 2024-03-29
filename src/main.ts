import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // configurar prefijo para que los endpoints partan de api/
  app.setGlobalPrefix('api');

  // configuración global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // transformar query params (siempre viene string)
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );
  await app.listen(process.env.PORT);
}
bootstrap();
