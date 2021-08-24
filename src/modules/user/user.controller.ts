import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from '../../common/helpers/responses/success.response';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../models/user.entity';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/login')
  @HttpCode(200)
  async login(@Body() body) {
    const response = await this.userService.login(body);
    return Response.send('Login successful', response);
  }

  @Post('auth/register')
  @HttpCode(200)
  async register(@Body() body) {
    const response = await this.userService.register(body);
    return Response.send('Registration successful', response);
  }

  @Get('account')
  @UseGuards(AuthGuard)
  async getAccount(@GetUser() user: User) {
    const response = await this.userService.getProfile(user);
    return Response.send('Profile retrieved', response);
  }
}
