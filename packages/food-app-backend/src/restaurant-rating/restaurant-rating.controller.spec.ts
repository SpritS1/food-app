import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantRatingController } from './restaurant-rating.controller';
import { RestaurantRatingService } from './restaurant-rating.service';

describe('RestaurantRatingController', () => {
  let controller: RestaurantRatingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantRatingController],
      providers: [RestaurantRatingService],
    }).compile();

    controller = module.get<RestaurantRatingController>(RestaurantRatingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
