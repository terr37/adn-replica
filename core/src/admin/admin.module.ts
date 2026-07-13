import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioAdmin } from './entities/usuario.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from './auth/auth.module';
import { Permiso } from '../planeamiento/entities/permiso.entity';
import { Inmueble } from '../aseo/entities/inmueble.entity';
import { Factura } from '../aseo/entities/factura.entity';
import { Incidencia } from '../aseo/entities/incidencia.entity';
import { Fosa } from '../servicios-publicos/entities/fosa.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsuarioAdmin,
      Permiso,
      Inmueble,
      Factura,
      Incidencia,
      Fosa,
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
