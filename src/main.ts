import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { Swagger } from './common/swagger';
import { AppLogger } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(RequestIdMiddleware);
  app.useLogger(new AppLogger());
  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  new Swagger(app);

  const PORT = process.env.PORT || 5500;

  app.listen(PORT,()=>{
    console.log(PORT)
  })
}
bootstrap();
