import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Res,
  Patch,
} from '@nestjs/common';
import { RestaurantRatingService } from './restaurant-rating.service';
import { CreateRestaurantRatingDto } from './dto/create-restaurant-rating.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateRestaurantRatingDto } from './dto/update-restaurant-rating.dto';

@Controller('restaurant-rating')
export class RestaurantRatingController {
  constructor(
    private readonly restaurantRatingService: RestaurantRatingService,
  ) {}

  @Post()
  async create(
    @Body() createRestaurantRatingDto: CreateRestaurantRatingDto,
    @Res() res,
  ) {
    try {
      await this.restaurantRatingService.create(createRestaurantRatingDto);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Rating added successfully' });
    } catch (error) {
      console.error('Error while creating rating:', error);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Public()
  @Get(':restaurantId')
  async getRatingsByRestaurantId(@Param('restaurantId') restaurantId: string) {
    return this.restaurantRatingService.getRatingsByRestaurantId(restaurantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantRatingService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantRatingService.remove(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantRatingDto: UpdateRestaurantRatingDto,
  ) {
    return await this.restaurantRatingService.updateRating(
      id,
      updateRestaurantRatingDto,
    );
  }
}
