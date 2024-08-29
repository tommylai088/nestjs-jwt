import { Controller, Request, Post, UseGuards, Get, Body, Param } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signup(@Body() user: any) {
        return this.authService.signup(user)
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        console.log(req);
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Get('activate/:token')
    activate(@Param() params) {
        return this.authService.activate(params.token);
    }

    @Post('reset-password')
    resetPassword(@Request() req) {
        console.log(req);
    }

}
