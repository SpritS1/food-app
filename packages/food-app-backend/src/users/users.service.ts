import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from 'src/schemas/restaurant.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }

  async getRestaurantsByUserId(userId: string): Promise<Restaurant[]> {
    const restaurants = await this.restaurantModel.find({ owner: userId });
    return restaurants;
  }
}
