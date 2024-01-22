import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { Restaurant, RestaurantSchema } from 'src/schemas/restaurant.schema';
import { RestaurantRatingModule } from 'src/restaurant-rating/restaurant-rating.module';
import { ReservationModule } from 'src/reservation/reservation.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    RestaurantRatingModule,
    ReservationModule,
  ],
  providers: [UsersService, AuthService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
