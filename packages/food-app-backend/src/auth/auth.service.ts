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
import { AccountType } from '../../../shared/src/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!user) throw new UnauthorizedException();

    if (!bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = { email: user.email };

    return {
      message: 'Successful login',
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    email: string,
    password: string,
    accountType: AccountType,
  ): Promise<void> {
    if (await this.usersService.findOne(email))
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      accountType,
    });
    await newUser.save();
  }
}
