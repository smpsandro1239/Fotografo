import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Payload autenticado injetado pela JwtStrategy em req.user
interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): AuthUser | string => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUser }>();
    if (data) {
      return request.user[data as keyof AuthUser];
    }
    return request.user;
  },
);
