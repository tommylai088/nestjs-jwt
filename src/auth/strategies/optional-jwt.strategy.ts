import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OptionalJwtStrategy extends PassportStrategy(Strategy, 'optional-jwt') {
  constructor(private configService: ConfigService) {
    super({
      // Extract JWT from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Set ignoreExpiration to true to allow non-expired tokens
      ignoreExpiration: false,
      // Secret key to validate the JWT signature, read from environment variables
      secretOrKey: configService.get<string>(jwtConstants.secret),
      // Pass the request to the validate function
      passReqToCallback: true,
    });
  }

  // This method will be called after the token has been verified
  async validate(req: Request, payload: any) {
    // Optionally, we can add custom logic here to fetch user details from a database
    // If the JWT is valid, return the user object; otherwise, return null
    if (payload) {
      return {
        userId: payload.userId,
        username: payload.username,
      };
    }
    return null; // If no valid JWT, return null
  }
}