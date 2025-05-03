import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UserDto } from 'src/dto/user.dto';

const EXPIRE_TIME = 3600 * 1000 // 1 hour refresh token.
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(username);
    if (!user) {
      return null;
    }
    const passwordValid = await bcrypt.compare(password, user?.password)
    if (!passwordValid) {
      return null;
    }
    return user;
  }

  async login(user: UserDto) {
    const payload = {
      username: user.username,
      userId: user.id,
      sub: user.id,
    };
    return {
      user: {
        userId: user.id,
        username: user.username,
      },
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.jwtSecretKey,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
        secret: process.env.jwtRefreshTokenKey,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }


  async signup(user: CreateUserDto) {
    const { username, password, email } = user;
    if (!username) {
      throw new BadRequestException('username can not be null or empty');
    }
    if (!password) {
      throw new BadRequestException('password can not be null or empty');
    }

    const foundUser = await this.usersService.getUser(username);
    const foundUserByEmail = await this.usersService.getUserByEmail(email);
    if (foundUser) {
      throw new BadRequestException('username is already exists');
    }

    if (foundUserByEmail) {
      throw new BadRequestException('email is already exists');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const result = await this.usersService.insertUser(
      username,
      hashedPassword,
      email,
    );
    // TODO send email
    return {
      msg: 'User successfully registered',
      userId: result?._id,
      userName: result?.username,
      email: result?.email
    };
  }

  async refreshToken(user: any) {
    const payload = {
      username: user.username,
      userId: user.userId,
      sub: user.userId,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.jwtSecretKey,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
        secret: process.env.jwtRefreshTokenKey,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }

}