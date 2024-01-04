import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ObjectId } from 'mongoose';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Public()
  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('city') city?: string,
    @Query('cuisine') cuisine?: string,
  ) {
    return this.restaurantService.findAll({ name, city, cuisine });
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.restaurantService.findOne(id);
  }

  @Roles(Role.BusinessOwner)
  @UseInterceptors(FileInterceptor('mainImage'))
  @Post()
  create(
    @UploadedFile() mainImage: Express.Multer.File,
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Req() req,
  ) {
    const userId: ObjectId = req.user.userId;

    return this.restaurantService.create(
      createRestaurantDto,
      userId,
      mainImage,
    );
  }

  @Roles(Role.BusinessOwner)
  @Patch(':id')
  async update(
    @Param('id') id: ObjectId,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const restaurant = await this.restaurantService.findOne(id);

    if (userId !== restaurant.owner) {
      throw new UnauthorizedException(
        'User is not authorized to update this restaurant',
      );
    }

    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.restaurantService.remove(id);
  }
}
