import { Injectable } from '@nestjs/common';
import { CreateRestaurantRatingDto } from './dto/create-restaurant-rating.dto';
import { Restaurant } from 'src/schemas/restaurant.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RestaurantRating } from 'src/schemas/restaurantRating.schema';
import { RestaurantRatingDTO } from './dto/get-rating.dto';
import { RatingInfo } from './utils/ratingInfo';
import { UpdateRestaurantRatingDto } from './dto/update-restaurant-rating.dto';

@Injectable()
export class RestaurantRatingService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
    @InjectModel(RestaurantRating.name)
    private ratingModel: Model<RestaurantRating>,
  ) {}

  async create(createRestaurantRatingDto: CreateRestaurantRatingDto) {
    const { restaurantId, userId } = createRestaurantRatingDto;

    const rating = await this.ratingModel.findOne({ restaurantId, userId });

    if (rating) {
      throw new Error('You have already rated this restaurant');
    }

    await this.ratingModel.create({
      ...createRestaurantRatingDto,
      user: userId,
    });

    return `Rating added: ${createRestaurantRatingDto.rating}`;
  }

  async getRatingsByRestaurantId(
    restaurantId: string,
  ): Promise<RestaurantRatingDTO[]> {
    const ratings = await this.ratingModel
      .find({ restaurantId: restaurantId })
      .populate({
        path: 'user',
        select: 'name',
      });

    const ratingDTOs = ratings.map(
      (rating) =>
        ({
          _id: rating._id,
          rating: rating.rating,
          comment: rating.comment,
          user_name: rating.user.name,
          createdAt: rating.createdAt,
          ownerReply: rating.ownerReply,
        }) as RestaurantRatingDTO,
    );

    return ratingDTOs;
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurantRating`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurantRating`;
  }

  async getAverageRating(restaurantId: Types.ObjectId): Promise<RatingInfo> {
    const ratings = await this.ratingModel.find({
      restaurantId: restaurantId.toString(),
    });

    if (ratings.length === 0)
      return {
        averageRating: 0,
        ratingsCount: 0,
      };

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    return {
      averageRating,
      ratingsCount: ratings.length,
    };
  }

  async getUserRatings(userId: string): Promise<RestaurantRatingDTO[]> {
    const ratings = await this.ratingModel
      .find({ user: userId })
      .populate({
        path: 'user',
        select: 'name',
      })
      .populate({ path: 'restaurantId' });

    const ratingDTOs = ratings.map(
      (rating) =>
        ({
          _id: rating._id,
          rating: rating.rating,
          comment: rating.comment,
          user_name: rating.user.name,
          createdAt: rating.createdAt,
          restaurant: rating.restaurantId,
        }) as RestaurantRatingDTO,
    );

    return ratingDTOs;
  }

  async updateRating(ratingId: string, updateDto: UpdateRestaurantRatingDto) {
    const { rating, comment, ownerReply } = updateDto;

    const updatedRating = await this.ratingModel.findByIdAndUpdate(ratingId, {
      rating,
      comment,
      ownerReply,
    });

    if (!updatedRating) {
      throw new Error('Rating not found');
    }

    return 'Rating updated successfully';
  }
}
