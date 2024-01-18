import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';
import { Restaurant } from 'src/schemas/restaurant.schema';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(OwnershipGuard)
  @Get(':id/restaurants')
  async getRestaurantsByUserId(
    @Param('id') userId: string,
  ): Promise<Restaurant[]> {
    return this.usersService.getRestaurantsByUserId(userId);
  }

  @UseGuards(OwnershipGuard)
  @Get(':id/favorites')
  async getFavoriteRestaurants(
    @Param('id') userId: string,
  ): Promise<Restaurant[]> {
    return await this.usersService.getFavoriteRestaurants(userId);
  }

  @UseGuards(OwnershipGuard)
  @Post(':id/favorites')
  async addFavoriteRestaurant(
    @Param('id') userId: string,
    @Req() req,
    @Res() res,
  ): Promise<void> {
    try {
      const restaurantId = req.body.restaurantId;

      await this.usersService.addFavoriteRestaurant(userId, restaurantId);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Restaurant added to favorites successfully.' });
    } catch (error) {
      console.error('Error adding restaurant to favorites:', error);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id/favorites/:restaurantId')
  async removeFavoriteRestaurant(
    @Param('id') userId: string,
    @Param('restaurantId') restaurantId: string,
    @Res() res,
  ): Promise<void> {
    try {
      this.usersService.removeFavoriteRestaurant(userId, restaurantId);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Restaurant removed from favorites successfully.' });
    } catch (error) {
      console.error('Error removing restaurant from favorites:', error);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
