import { BadRequestException, Injectable } from '@nestjs/common';
import { IServiceResponse } from '../../common/interfaces/service.interface';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../../models/user.entity';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from '../../common/interfaces/jwt.interface';
import { JWT_SECRET } from '../../config/env.config';
import * as CardGenerator from 'creditcard-generator';
import { Ethereum } from '../../providers/web3';
import { Wallet } from '../../models/wallet.entity';
import { Card } from '../../models/card.entity';
import * as OTPGenerator from 'n-digit-token';

@Injectable()
export class UserService {
  async login(payload): Promise<IServiceResponse> {
    payload.email = payload.email?.trim().toLowerCase();
    const user = await getRepository(User).findOne({
      where: {
        email: payload.email,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid email');
    }

    if (!bcrypt.compareSync(payload.password, user.password)) {
      throw new BadRequestException('Invalid password');
    }

    const token = await this.signToken(user);
    return {
      data: {
        token,
      },
    };
  }

  async register(payload): Promise<IServiceResponse> {
    payload.email = payload.email.trim().toLowerCase();
    const checkUser = await getRepository(User).findOne({
      where: [
        {
          email: payload.email,
        },
        {
          username: payload.username,
        },
      ],
    });

    if (checkUser) {
      throw new BadRequestException('Account already exist');
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.save(User, {
        username: payload.username,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        password: bcrypt.hashSync(payload.password, 8),
      });

      const ethWallet = await Ethereum.generateWallet(user.custom_id);
      const wallet = await queryRunner.manager.save(Wallet, {
        currency: 'NGN',
        account_number: OTPGenerator.generateSecureToken(10).toString(),
        deposit_address: ethWallet.address,
        privateKey: ethWallet.privateKey,
        index: user.custom_id,
        user,
      });

      await queryRunner.manager.save(Card, {
        wallet,
        user,
        card_number: CardGenerator.GenCC()[0],
        card_expire_year: '2023',
        card_expire_month: '12',
        card_cvv: OTPGenerator.generateSecureToken(3).toString(),
        card_pin: '1234',
      });

      await queryRunner.commitTransaction();
      const token = await this.signToken(user);
      return {
        data: {
          token,
        },
      };
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        'Something went wrong and we could not create an account for you, kindly try again',
      );
    } finally {
      await queryRunner.release();
    }

    return;
  }

  async getProfile(user: User): Promise<IServiceResponse> {
    const account = await getRepository(User).findOne({
      where: { id: user.id },
    });
    if (!account) {
      throw new BadRequestException('Invalid user');
    }

    return {
      data: account,
    };
  }

  async signToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
    };
    return sign(payload, JWT_SECRET, { expiresIn: '1hr' });
  }

  async signRefreshToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
    };
    return sign(payload, JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 });
  }
}
