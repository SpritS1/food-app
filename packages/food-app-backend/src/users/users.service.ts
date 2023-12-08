import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { AccountType } from '../../../shared/src/types';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async findOne(
    email: string,
    accountType?: AccountType,
  ): Promise<User | null> {
    return await this.userModel.findOne({ email, accountType });
  }
}
