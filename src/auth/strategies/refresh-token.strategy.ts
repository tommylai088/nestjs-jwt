import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
    constructor() {
        super({
            // Extract token from the Authorization header
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Refresh'),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    // This method runs after successful JWT extraction and validation
    async validate(payload: any) {
        return {
            userId: payload.sub,
            username: payload.username,
        };
    }
}