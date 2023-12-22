import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ObjectId } from 'mongoose';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  async findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.restaurantService.findOne(id);
  }

  @Roles(Role.BusinessOwner)
  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto, @Req() req) {
    const userId: ObjectId = req.user.userId;
    return this.restaurantService.create(createRestaurantDto, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: ObjectId,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.restaurantService.remove(id);
  }
}
