import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'; // ✅ вот так

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // теперь всё ок

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(3000);
  console.log('Backend listening on http://localhost:3000');
}
bootstrap();
