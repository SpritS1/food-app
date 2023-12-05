import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessUsersModule } from './business-users/business-users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mateuszpenkala:YVGO0xCtXDjQmIfh@foodapp.sn7cfrx.mongodb.net/?retryWrites=true&w=majority',
    ),
    AuthModule,
    UsersModule,
    BusinessUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
