import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from 'src/schemas/restaurant.schema';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multerConfig';
import { Cuisine, CuisineSchema } from 'src/schemas/cuisine.schema';
import { RestaurantRatingModule } from 'src/restaurant-rating/restaurant-rating.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Cuisine.name, schema: CuisineSchema },
    ]),

    MulterModule.register(multerOptions),
    RestaurantRatingModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
