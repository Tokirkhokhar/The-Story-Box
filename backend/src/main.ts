import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  logger.log(`Allowed CORS origins: ${JSON.stringify(appConfig.allowedOrigins)}`);
  app.enableCors({
    origin: appConfig.allowedOrigins
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('The Story Box API')
    .setDescription('API documentation for The Story Box catalog service.')
    .setVersion('1.0')
    .addTag('Health')
    .addTag('Authors')
    .addTag('Publishers')
    .addTag('Books')
    .addTag('Book Authors')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(appConfig.port);
}
bootstrap();
