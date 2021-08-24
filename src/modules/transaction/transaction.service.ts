import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../models/user.entity';
import { IServiceResponse } from '../../common/interfaces/service.interface';
import { paginate } from 'nestjs-typeorm-paginate';
import { getRepository } from 'typeorm';
import { Transaction } from '../../models/transaction.entity';
import { Wallet } from '../../models/wallet.entity';
import { Ethereum } from '../../providers/web3';
import { PaymentStatus } from '../../common/constants/payment.constants';

@Injectable()
export class TransactionService {
  async getTransactions(payload, user: User): Promise<IServiceResponse> {
    const transactions = await paginate(
      getRepository(Transaction),
      {
        limit: payload.limit || 25,
        page: payload.page || 1,
      },
      { where: { userId: user.id } },
    );
    return {
      data: transactions.items,
      meta: transactions.meta,
    };
  }

  async getSingleTransaction(payload, user: User): Promise<IServiceResponse> {
    const transaction = await getRepository(Transaction).findOne({
      where: { userId: user.id, id: payload.id },
    });
    if (!transaction) {
      throw new NotFoundException('cannot find transaction');
    }
    return {
      data: transaction,
    };
  }

  async transfer(payload, user: User): Promise<IServiceResponse> {
    const wallet = await getRepository(Wallet).findOne({
      where: { userId: user.id },
    });
    if (!wallet) {
      throw new BadRequestException('Contact support');
    }

    const balance = await Ethereum.getBalance(wallet.deposit_address);
    if (balance.balance < payload.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const anotherUserAddress = await getRepository(Wallet).findOne({
      where: { account_number: payload.to },
    });
    if (!anotherUserAddress) {
      throw new BadRequestException('Invalid customer account number');
    }

    try {
      const transaction = await Ethereum.transfer(
        anotherUserAddress.deposit_address,
        wallet.privateKey,
        payload.amount,
        wallet.deposit_address,
      );
      await getRepository(Transaction).save({
        amount: payload.amount,
        status: true,
        tx_status: PaymentStatus.success,
        txn_type: 'debit',
        channel: 'internal',
        metadata: transaction,
        userId: user.id,
        walletId: wallet.id,
      });
      await getRepository(Transaction).save({
        amount: payload.amount,
        status: true,
        tx_status: PaymentStatus.success,
        txn_type: 'credit',
        channel: 'internal',
        metadata: transaction,
        userId: anotherUserAddress.userId,
        walletId: anotherUserAddress.id,
      });
      return;
    } catch (e) {
      console.log(e);
      throw new BadRequestException("We couldn't process your transfer'");
    }
    return;
  }
}
