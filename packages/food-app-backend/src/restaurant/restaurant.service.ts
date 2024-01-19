import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from 'src/schemas/restaurant.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { Cuisine } from 'src/schemas/cuisine.schema';
import { RestaurantRatingService } from 'src/restaurant-rating/restaurant-rating.service';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    @InjectModel(Cuisine.name) private cuisineModel: Model<Cuisine>,
    private readonly ratingService: RestaurantRatingService,
  ) {}
  @Roles(Role.BusinessOwner)
  async create(
    createRestaurantDto: CreateRestaurantDto,
    ownerId: ObjectId,
    mainImage: Express.Multer.File,
  ) {
    const newRestaurant = new this.restaurantModel({
      ...createRestaurantDto,
      cuisine: await this.cuisineModel.findById(createRestaurantDto.cuisine),
      owner: ownerId,
    });

    if (mainImage) {
      newRestaurant.images.push(`/uploads/${mainImage.filename}`);
    }

    return await newRestaurant.save();
  }

  async findAll(filters?: { name?: string; city?: string; cuisine?: string }) {
    const query: any = {};

    if (filters) {
      if (filters.name) {
        query.name = { $regex: filters.name, $options: 'i' };
      }
      if (filters.city) {
        query.city = { $regex: filters.city, $options: 'i' };
      }
      if (filters.cuisine) {
        const cuisineIds = await this.cuisineModel
          .find({ name: { $regex: filters.cuisine, $options: 'i' } })
          .select('_id');
        query.cuisine = { $in: cuisineIds.map((c) => c._id) };
      }
    }

    const restaurants = await this.restaurantModel
      .find(query)
      .populate('cuisine');

    const restaurantsWithAvgRating = await Promise.all(
      restaurants.map(async (restaurant) => {
        const ratingInfo = await this.ratingService.getAverageRating(
          restaurant._id,
        );

        return {
          ...restaurant.toJSON(),
          ratingInfo,
        };
      }),
    );

    return restaurantsWithAvgRating;
  }

  async findOne(id: Types.ObjectId) {
    const restaurant = await this.restaurantModel
      .findById(id)
      .populate('cuisine');

    const avgRating = await this.ratingService.getAverageRating(id);

    return {
      ...restaurant.toJSON(),
      avgRating,
    };
  }

  async update(id: Types.ObjectId, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.restaurantModel.findById(id);

    restaurant.name = updateRestaurantDto.name;
    restaurant.city = updateRestaurantDto.city;
    restaurant.description = updateRestaurantDto.description;
    restaurant.phone = updateRestaurantDto.phone;
    restaurant.email = updateRestaurantDto.email;
    restaurant.cuisine = await this.cuisineModel.findById(
      updateRestaurantDto.cuisine,
    );

    await restaurant.save();
    return restaurant;
  }

  remove(id: ObjectId) {
    throw new Error('Method not implemented.');
  }
}
