import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountType, AuthResponse } from '../../../shared/src/types';
import AuthTokenPayload from '../../../shared/src/types/AuthTokenPayload';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: AuthTokenPayload = {
      userId: user._doc._id,
      email: user._doc.email,
      name: user._doc.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(
    email: string,
    password: string,
    accountType: AccountType,
    name: string,
  ): Promise<AuthResponse> {
    try {
      if (await this.userModel.findOne({ email })) {
        throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const roles: Role[] =
        accountType === 'regular' ? [Role.User] : [Role.BusinessOwner];

      const newUser = new this.userModel({
        email,
        password: hashedPassword,
        roles,
        name,
      });

      await newUser.save();

      const payload: AuthTokenPayload = {
        userId: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
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
