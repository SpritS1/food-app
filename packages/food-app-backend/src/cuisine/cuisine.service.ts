import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cuisine } from 'src/schemas/cuisine.schema';

@Injectable()
export class CuisineService {
  constructor(
    @InjectModel(Cuisine.name) private cuisineModel: Model<Cuisine>,
  ) {}

  async getCuisines(name?: string) {
    if (name === undefined) return await this.cuisineModel.find();

    const regex = new RegExp(`^${name}`, 'i');
    const cuisines = await this.cuisineModel.find({ name: { $regex: regex } });
    return cuisines;
  }
}
