import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRoles } from '../enums/user.enum';
 
@Injectable()
export class BuyerRoleGuard implements CanActivate {

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (req?.user) {
      return req.user.role === UserRoles.BUYER;
    }

    return false;
  }
}
