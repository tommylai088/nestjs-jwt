import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';
import { v4 as uuidv4 } from 'uuid';

// This should be a real class/interface representing a user entity
@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) { }

  async insertUser(userName: string, password: string, email: string) {
    const username = userName.toLowerCase();
    const userId = uuidv4();
    const token = uuidv4();
    const newUser = new this.userModel({
      username,
      password,
      userId,
      email,
      activated: 0,
      token
    });
    await newUser.save();
    return newUser;
  }

  async getUser(userName: string) {
    const username = userName.toLowerCase();
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async getUserByEmail(emailStr: string) {
    const email = emailStr.toLowerCase();
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async getUserByToken(token: string) {
    const user = await this.userModel.findOne({ token });
    return user;
  }

  async updateUser(filter, update) {
    const user = await this.userModel.findOneAndUpdate(
      { ...filter },
      { ...update }
    )
    return user;
  }
}