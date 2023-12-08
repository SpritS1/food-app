import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountType, AuthResponse } from '../../../shared/src/types';
import { LoginDTO } from '../../../shared/src/dtos/LoginDTO';
import AuthTokenPayload from '../../../shared/src/types/AuthTokenPayload';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn({
    email,
    accountType,
    password,
  }: LoginDTO): Promise<AuthResponse> {
    const user = await this.usersService.findOne(email, accountType);

    if (!user) throw new UnauthorizedException();

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) throw new UnauthorizedException();

    const payload: AuthTokenPayload = {
      email: user.email,
      accountType: user.accountType,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    email: string,
    password: string,
    accountType: AccountType,
  ): Promise<AuthResponse> {
    try {
      if (await this.userModel.findOne({ email, accountType })) {
        throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new this.userModel({
        email,
        password: hashedPassword,
        accountType,
      });

      await newUser.save();

      const payload: AuthTokenPayload = {
        email: newUser.email,
        accountType: newUser.accountType,
      };
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        accessToken,
      };
    } catch (error) {
      console.error('Error during user registration:', error);

      throw error;
    }
  }
}
