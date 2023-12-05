import { Module } from '@nestjs/common';
import { BusinessUsersController } from './business-users.controller';

@Module({
  controllers: [BusinessUsersController]
})
export class BusinessUsersModule {}
