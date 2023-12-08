import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AccountType } from '../../../shared/dist/src/types';
import { LoginDTO } from '../../../shared/src/dtos/LoginDTO';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('check-email')
  async checkEmail(
    @Query('email') email: string,
    @Query('accountType') accountType: AccountType,
  ): Promise<boolean> {
    return Boolean(await this.userService.findOne(email, accountType));
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDTO) {
    return this.authService.signIn(loginDto);
  }

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('accountType') accountType: AccountType,
  ): Promise<{ accessToken: string }> {
    return this.authService.register(email, password, accountType);
  }
}
