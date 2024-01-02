import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ObjectId } from 'mongoose';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseGuards(OwnershipGuard)
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
