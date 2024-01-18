import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantRatingService } from './restaurant-rating.service';

describe('RestaurantRatingService', () => {
  let service: RestaurantRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantRatingService],
    }).compile();

    service = module.get<RestaurantRatingService>(RestaurantRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
