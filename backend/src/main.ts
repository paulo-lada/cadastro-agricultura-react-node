import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core/nest-factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5173' });

  const config = new DocumentBuilder()
    .setTitle('Agricultura API')
    .setDescription('API para gerenciamento de produtores rurais')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // outras configurações...

  await app.listen(3000);
}
bootstrap();
