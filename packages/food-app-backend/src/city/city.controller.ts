import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Public()
  @Get()
  async getCities(@Query('name') name: string) {
    return await this.cityService.getCities(name);
  }
}
