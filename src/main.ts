import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  await app.listen(port, '0.0.0.0').then(() => {
    console.log(`🚀 HTTP server running at -> ${port}`);
  });
}
bootstrap().catch((err) => {
  console.error('Fatal error at initializing', err);
});
