import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3000', // URL do frontend React
    credentials: true,
  });

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gestão de Estacionamento')
    .setDescription('Sistema completo de gestão de vagas')
    .setVersion('1.0')
    .addTag('vagas')
    .addTag('movimentacoes')
    .addTag('tarifas')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
  console.log('🚀 API rodando em http://localhost:8000');
  console.log('📚 Documentação em http://localhost:8000/api');
}
bootstrap();
