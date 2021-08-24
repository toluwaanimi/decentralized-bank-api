import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../models/user.entity';
import { Response } from '../../common/helpers/responses/success.response';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('')
  async get(@GetUser() user: User) {
    const response = await this.walletService.findOne(user);
    return Response.send('Wallet retrieved', response);
  }

  @Post('resolve')
  async resolveAccount(@Body() body) {
    const response = await this.walletService.verifyAccountNumber(body);
    return Response.send('Resolved account number', response);
  }

  @Get('card')
  async getCards(@GetUser() user: User) {
    const response = await this.walletService.getCard(user);
    return Response.send('Card retrieved', response);
  }
}
