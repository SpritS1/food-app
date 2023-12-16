import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { Restaurant, RestaurantSchema } from 'src/schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  providers: [UsersService, AuthService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
