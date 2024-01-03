import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from 'src/schemas/city.schema';

@Injectable()
export class CityService {
  constructor(@InjectModel(City.name) private cityModel: Model<City>) {}

  async getCities(name: string) {
    const regex = new RegExp(`^${name}`, 'i');
    const cities = await this.cityModel.find({ name: { $regex: regex } });
    return cities;
  }
}
