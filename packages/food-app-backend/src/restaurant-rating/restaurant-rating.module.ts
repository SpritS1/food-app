import { Module } from '@nestjs/common';
import { RestaurantRatingService } from './restaurant-rating.service';
import { RestaurantRatingController } from './restaurant-rating.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multerConfig';
import { Restaurant, RestaurantSchema } from 'src/schemas/restaurant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantRating } from './entities/restaurant-rating.entity';
import { RestaurantRatingSchema } from 'src/schemas/restaurantRating.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: RestaurantRating.name, schema: RestaurantRatingSchema },
    ]),

    MulterModule.register(multerOptions),
  ],
  controllers: [RestaurantRatingController],
  providers: [RestaurantRatingService],
  exports: [RestaurantRatingService],
})
export class RestaurantRatingModule {}
