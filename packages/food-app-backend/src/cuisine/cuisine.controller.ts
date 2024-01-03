import { Controller, Get, Query } from '@nestjs/common';
import { CuisineService } from './cuisine.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('cuisine')
export class CuisineController {
  constructor(private readonly cuisineService: CuisineService) {}

  @Public()
  @Get()
  async getCuisines(@Query('name') name: string) {
    return await this.cuisineService.getCuisines(name);
  }
}
