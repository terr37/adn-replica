import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioAdmin } from '../entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsuarioAdmin)
    private readonly usuarioRepo: Repository<UsuarioAdmin>,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const usuario = await this.usuarioRepo.findOne({
      where: { username, activo: true },
    });
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const passwordValido = await bcrypt.compare(
      password,
      usuario.password_hash,
    );
    if (!passwordValido)
      throw new UnauthorizedException('Credenciales inválidas');

    const token = this.jwtService.sign({
      sub: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
    });

    return {
      access_token: token,
      rol: usuario.rol,
      username: usuario.username,
    };
  }

  verificarToken(token: string) {
    try {
      return this.jwtService.verify<{
        sub: string;
        username: string;
        rol: string;
      }>(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
