import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import AuthTokenPayload from 'src/types/AuthTokenPayload';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: AuthTokenPayload = request.user;

    const ownerId = request.params.id;

    // Roles are missing in user object add it or remove this check
    // if (user.roles.includes(Role.Admin)) return true;

    if (ownerId && user.userId !== ownerId) {
      return false; // User is trying to access someone else's resource
    }

    return true;
  }
}
