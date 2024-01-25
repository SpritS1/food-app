import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RestaurantRatingService } from 'src/restaurant-rating/restaurant-rating.service';
import { Restaurant } from 'src/schemas/restaurant.schema';
import { User } from 'src/schemas/user.schema';
import { UpdateUserDTO } from './dto/update-user.dto';
import { RestaurantRating } from 'src/schemas/restaurantRating.schema';
import { RestaurantRatingDTO } from 'src/restaurant-rating/dto/get-rating.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    private readonly ratingService: RestaurantRatingService,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }

  async getRestaurantsByUserId(userId: string): Promise<Restaurant[]> {
    const restaurants = await this.restaurantModel.find({ owner: userId });
    return restaurants;
  }

  async getFavoriteRestaurants(userId: string): Promise<Restaurant[]> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const restaurants = await this.restaurantModel.find({
      _id: { $in: user.favoriteRestaurants },
    });

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

    // console.log(restaurantsWithAvgRating);

    return restaurantsWithAvgRating;
  }

  async addFavoriteRestaurant(
    userId: string,
    restaurantId: string,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const restaurantObjectId = new Types.ObjectId(restaurantId);

    if (user.favoriteRestaurants.includes(restaurantObjectId)) {
      throw new Error('Restaurant is already in your favorites');
    }

    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { favoriteRestaurants: restaurantId },
    });
  }

  async removeFavoriteRestaurant(
    userId: string,
    restaurantId: string,
  ): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { favoriteRestaurants: restaurantId } },
        { new: true },
      )
      .populate('favoriteRestaurants');
  }

  async update(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDTO, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }

    return updatedUser;
  }

  async getUserReviews(userId: string): Promise<RestaurantRatingDTO[]> {
    const reviews = await this.ratingService.getUserRatings(userId);
    return reviews;
  }
}
