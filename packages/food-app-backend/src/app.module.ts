import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { OwnershipGuard } from './auth/guards/ownership.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LocationModule } from './location/location.module';
import { CuisineModule } from './cuisine/cuisine.module';
import { CityModule } from './city/city.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://mateuszpenkala:YVGO0xCtXDjQmIfh@foodapp.sn7cfrx.mongodb.net/?retryWrites=true&w=majority',
    ),
    AuthModule,
    UsersModule,
    RestaurantModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', '..', 'uploads'), // Set the static files location
      serveRoot: '/uploads', // Map the files under a routes
    }),
    LocationModule,
    CuisineModule,
    CityModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'OWNERSHIP_GUARD',
      useClass: OwnershipGuard,
    },
  ],
})
export class AppModule {}
