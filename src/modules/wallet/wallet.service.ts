import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../models/user.entity';
import { getRepository } from 'typeorm';
import { Wallet } from '../../models/wallet.entity';
import { Ethereum } from '../../providers/web3';
import { IServiceResponse } from '../../common/interfaces/service.interface';
import { Card } from '../../models/card.entity';

@Injectable()
export class WalletService {
  async findOne(user: User): Promise<IServiceResponse> {
    const wallet = (
      await getRepository(Wallet).findOne({
        where: { userId: user.id },
      })
    ).toJSON();
    if (!wallet) {
      throw new BadRequestException(
        'Kindly contact support for wallet activation',
      );
    }
    const balance = await Ethereum.getBalance(wallet.deposit_address);
    return {
      data: {
        balance: balance.balance,
        currency: balance.symbol,
        ...wallet,
      },
    };
  }

  async verifyAccountNumber(payload): Promise<IServiceResponse> {
    const wallet = await getRepository(Wallet).findOne({
      where: { account_number: payload.account_number },
      relations: ['user'],
    });
    if (!wallet) {
      throw new BadRequestException("Couldn't resolve account number");
    }
    return {
      data: {
        account_number: wallet.account_number,
        name: wallet.user.last_name + ' ' + wallet.user.first_name,
      },
    };
  }

  async getCard(user: User): Promise<IServiceResponse> {
    const card = await getRepository(Card).findOne({
      where: { userId: user.id },
    });
    if (!card) {
      throw new BadRequestException(
        'Kindly contact support for debit card processing',
      );
    }
    return {
      data: {
        ...card,
      },
    };
  }
}
