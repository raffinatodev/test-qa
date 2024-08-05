import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Raffinato')
    .setDescription('Api para testes de candidatos para vaga de QA')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  await app.listen(3000);
}
bootstrap();
