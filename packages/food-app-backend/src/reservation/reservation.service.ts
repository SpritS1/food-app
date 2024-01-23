import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from 'src/schemas/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from 'src/schemas/restaurant.schema';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const createdReservation = new this.reservationModel(createReservationDto);
    return createdReservation.save();
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel.find().exec();
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id).exec();
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    return reservation;
  }

  async findAllByRestaurant(restaurantId: string): Promise<Reservation[]> {
    return this.reservationModel.find({ restaurant: restaurantId }).exec();
  }

  async findAllNotConfirmedByRestaurant(
    restaurantId: string,
  ): Promise<Reservation[]> {
    return this.reservationModel
      .find({ restaurant: restaurantId, isConfirmed: false })
      .exec();
  }

  async findAllCanceledByRestaurant(
    restaurantId: string,
  ): Promise<Reservation[]> {
    return this.reservationModel
      .find({ restaurant: restaurantId, isCancelled: true })
      .exec();
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const updatedReservation = await this.reservationModel
      .findByIdAndUpdate(id, updateReservationDto, { new: true })
      .exec();
    if (!updatedReservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    return updatedReservation;
  }

  async remove(id: string): Promise<void> {
    const deletedReservation = await this.reservationModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedReservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
  }

  async getUserReservations(userId: string): Promise<Reservation[]> {
    return await this.reservationModel
      .find({ user: userId })
      .populate('restaurant')
      .sort({ reservationDate: 'desc' });
  }

  async getOwnerReservations(userId: string): Promise<Reservation[]> {
    const restaurants = await this.restaurantModel.find({ owner: userId });
    const restaurantIds = restaurants.map((restaurant) =>
      restaurant._id.toString(),
    );

    const reservations = await this.reservationModel
      .find({ restaurant: { $in: restaurantIds } })
      .populate('restaurant')
      .sort({ reservationDate: 'desc' });

    console.log(reservations);

    return reservations;
  }
}
