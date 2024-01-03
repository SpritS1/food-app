import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Public()
  @Get()
  async getLocation(@Query('location') location: string) {
    return await this.locationService.getLocation(location);
  }
}
