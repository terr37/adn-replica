import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaneamientoModule } from './planeamiento/planeamiento.module';
import { AseoModule } from './aseo/aseo.module';
import { ServiciosPublicosModule } from './servicios-publicos/servicios-publicos.module';
import { MesaAyudaModule } from './mesa-ayuda/mesa-ayuda.module';
import { PagosModule } from './pagos/pagos.module';
import { AdminModule } from './admin/admin.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Carga las variables de .env globalmente
    ConfigModule.forRoot({ isGlobal: true }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/panel',
      exclude: ['/api/(.*)'],
    }),

    // Conexión a PostgreSQL con TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // En desarrollo: crea las tablas automáticamente
      }),
      inject: [ConfigService],
    }),

    PlaneamientoModule,

    AseoModule,

    ServiciosPublicosModule,

    MesaAyudaModule,

    PagosModule,

    AdminModule,

    // Aquí irán los módulos de cada funcionalidad (los agregas en la Parte 4)
  ],
})
export class AppModule {}
