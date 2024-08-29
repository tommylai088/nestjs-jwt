import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(username);
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      return {
        userId: user.id,
        userName: user.username
      };
    }
    return null;
  }

  async login(user: any) {
    console.log(user);
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(user: any) {
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
      userId: result.id,
      userName: result.username
    };
  }

  async activate(token: string) {
    if (!token) {
      throw new BadRequestException('missing token');
    }
    const user = await this.usersService.getUserByToken(token);
    if (!user) {
      throw new BadRequestException('token is not valid');
    }
    if(user.activated === 1) {
      throw new BadRequestException('user is already active');
    }

    const updatedUser = await this.usersService.updateUser(
      {
        token
      },
      {
        token: null,
        activated: 1
      }
    );

    return {
      msg: 'User successfully activated',
      userId: updatedUser.id,
      userName: updatedUser.username
    };
  }

  async resetPassword(token: string, ) {
    // if(!token) {
    //   throw new BadRequestException('missing token');
    // }
    // const user = await this.usersService.getUserByToken(token);
    // if (!user) {
    //   throw new BadRequestException('token is not valid');
    // }
    // if(user.activated == 0) {
    //   throw new BadRequestException('user is not active');
    // }
   

    // const updatedUser = await this.usersService.updateUser(
    //   {
    //     token
    //   },
    //   {
    //     token: null,
    //     activated: 1
    //   }
    // );
    

  }
}