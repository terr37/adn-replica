import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedInmuebles } from './aseo/aseo.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS (para que el Portal Web y la Caja puedan llamar al CORE)
  app.enableCors();

  // Activa la validación automática de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  const dataSource = app.get(DataSource);
  await seedInmuebles(dataSource);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`CORE corriendo en http://localhost:${port}/api`);
}
void bootstrap();
