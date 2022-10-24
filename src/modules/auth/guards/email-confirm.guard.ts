import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import RequestWithUser from "../interfaces/request-with-user.interface";

@Injectable()
export class EmailConfirmGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request.user?.isVerified) {
      throw new UnauthorizedException('You must confirm your email before using this feature');
    }

    return true;
  }
}