import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

// Payload injetado pela JwtStrategy em req.user
interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export const ROLES_KEY = 'roles';
// Decorator de RBAC: @Roles(UserRole.ADMIN, UserRole.PHOTOGRAPHER)
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    if (!user || !requiredRoles.includes(user.role as UserRole)) {
      throw new ForbiddenException(
        'Permissões insuficientes para este recurso',
      );
    }
    return true;
  }
}
