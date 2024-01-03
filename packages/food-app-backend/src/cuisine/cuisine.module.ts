import { Module } from '@nestjs/common';
import { CuisineController } from './cuisine.controller';
import { CuisineService } from './cuisine.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cuisine, CuisineSchema } from 'src/schemas/cuisine.schema';

@Module({
  controllers: [CuisineController],
  providers: [CuisineService],
  imports: [
    MongooseModule.forFeature([{ name: Cuisine.name, schema: CuisineSchema }]),
  ],
})
export class CuisineModule {}
