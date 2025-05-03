import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('optional-jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If there's no user, return null instead of throwing an error
    return user || null;
  }
}