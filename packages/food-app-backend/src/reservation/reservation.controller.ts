import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @Get('restaurant/:restaurantId')
  findAllByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.reservationService.findAllByRestaurant(restaurantId);
  }

  @Get('restaurant/:restaurantId/not-confirmed')
  findAllNotConfirmedByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.reservationService.findAllNotConfirmedByRestaurant(
      restaurantId,
    );
  }

  @Get('restaurant/:restaurantId/canceled')
  findAllCanceledByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.reservationService.findAllCanceledByRestaurant(restaurantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(id);
  }
}
