import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { Request } from 'express';

export const ROLES_KEY = 'roles';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token requerido');
    }

    const token = authHeader.split(' ')[1];
    const payload = this.authService.verificarToken(token);

    const rolesRequeridos = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (rolesRequeridos && !rolesRequeridos.includes(payload.rol)) {
      throw new ForbiddenException('No tienes permiso para esta acción');
    }

    return true;
  }
}
