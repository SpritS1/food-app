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
  async create(
    createRestaurantDto: CreateRestaurantDto,
    ownerId: ObjectId,
    mainImage: Express.Multer.File,
  ) {
    const newRestaurant = new this.restaurantModel({
      ...createRestaurantDto,
      owner: ownerId,
    });

    if (mainImage) {
      newRestaurant.images.push(`/uploads/${mainImage.filename}`);
    }

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

  async update(id: ObjectId, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.restaurantModel.findById(id);

    restaurant.name = updateRestaurantDto.name;
    restaurant.address = updateRestaurantDto.address;
    restaurant.description = updateRestaurantDto.description;
    restaurant.phone = updateRestaurantDto.phone;
    restaurant.email = updateRestaurantDto.email;
    restaurant.cuisine = updateRestaurantDto.cuisine;
    restaurant.images = updateRestaurantDto.images;

    await restaurant.save();
    return `This action updates a #${id} restaurant`;
  }

  remove(id: ObjectId) {
    return `This action removes a #${id} restaurant`;
  }
}
