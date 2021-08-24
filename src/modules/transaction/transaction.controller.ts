import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Ethereum } from '../../providers/web3';
import { AuthGuard } from '../../common/guards/auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../../models/user.entity';
import { Response } from '../../common/helpers/responses/success.response';

@Controller('transaction')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('')
  async getTransactions(@Query() query, @GetUser() user: User) {
    const response = await this.transactionService.getTransactions(query, user);
    return Response.send('Transactions retrieved', response);
  }

  @Get(':id')
  async getTransaction(@Param() params, @GetUser() user: User) {
    const response = await this.transactionService.getSingleTransaction(
      params,
      user,
    );
    return Response.send('Transaction retrieved', response);
  }

  @Post('')
  async send(@Body() body, @GetUser() user: User) {
    const response = await this.transactionService.transfer(body, user);
    return Response.send('Transaction successful', response);
  }
}
