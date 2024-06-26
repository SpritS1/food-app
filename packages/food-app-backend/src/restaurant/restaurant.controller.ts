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
  Put,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ObjectId, Types } from 'mongoose';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';
import { DaysOfWeek } from 'src/enums/daysOfWeek.enum';

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
  async findOne(@Param('id') id: Types.ObjectId) {
    return await this.restaurantService.findOne(id);
  }

  @Roles(Role.BusinessOwner)
  @UseInterceptors(FileInterceptor('mainImage'))
  @Post()
  async create(
    @UploadedFile() mainImage: Express.Multer.File,
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Req() req,
  ) {
    const userId: ObjectId = req.user.userId;
    console.log(mainImage);
    const restaurant = await this.restaurantService.create(
      createRestaurantDto,
      userId,
      mainImage,
    );
    return restaurant;
  }

  @Roles(Role.BusinessOwner)
  @Put(':id/opening-hours')
  async updateOpeningHours(
    @Param('id') id: Types.ObjectId,
    @Body()
    body: {
      openingHours: Record<DaysOfWeek, { open: Date; close: Date }>;
    },
  ) {
    return this.restaurantService.updateOpeningHours(id, body.openingHours);
  }

  @Roles(Role.BusinessOwner)
  @Patch(':id')
  async update(
    @Param('id') id: Types.ObjectId,
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
  async remove(@Param('id') id: ObjectId) {
    return await this.restaurantService.remove(id);
  }

  @Post(':id/addImage')
  @UseInterceptors(FileInterceptor('newImage'))
  async addImage(
    @Param('id') id: ObjectId,
    @UploadedFile() newImage: Express.Multer.File,
  ) {
    return await this.restaurantService.addImage(id, newImage);
  }

  @Delete(':restaurantId/image/:imageIndex')
  async removeImage(
    @Param('restaurantId') id: ObjectId,
    @Param('imageIndex') imageIndex: number,
  ) {
    return await this.restaurantService.removeImage(id, imageIndex);
  }
}
