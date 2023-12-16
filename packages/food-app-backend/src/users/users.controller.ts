import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
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
}
