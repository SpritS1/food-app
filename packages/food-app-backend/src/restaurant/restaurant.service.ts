import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from 'src/schemas/restaurant.schema';
import { Model, ObjectId } from 'mongoose';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RestaurantService {
  /**
   *
   */
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
  ) {}
  @Roles(Role.BusinessOwner)
  async create(createRestaurantDto: CreateRestaurantDto, ownerId: ObjectId) {
    const newRestaurant = new this.restaurantModel({
      ...createRestaurantDto,
      owner: ownerId,
    });
    return await newRestaurant.save();
  }

  async findAll() {
    const restaurants = await this.restaurantModel.find();
    return restaurants;
  }

  async findOne(id: ObjectId) {
    const restaurant = await this.restaurantModel.findById(id);
    return restaurant;
  }

  update(id: ObjectId, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: ObjectId) {
    return `This action removes a #${id} restaurant`;
  }
}
