import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}
