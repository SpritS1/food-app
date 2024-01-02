import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AccountType } from '../../../shared/dist/src/types';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req) {
    const res = await this.authService.login(req.user);
    return res;
  }

  @Public()
  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('accountType') accountType: AccountType,
  ): Promise<{ accessToken: string }> {
    return this.authService.register(email, password, accountType);
  }
}