import { AbstractEntity } from './base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { Card } from './card.entity';

@Entity('wallets')
export class Wallet extends AbstractEntity {
  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 20,
    scale: 8,
  })
  balance: number;

  @Column()
  currency: string;

  @Column({ default: true })
  allow_payment: boolean;

  @Column()
  account_number: string;

  @Column()
  deposit_address: string;

  @Column()
  index: number;

  @Column()
  privateKey: string;
  @Column()
  userId: string;

  @ManyToOne((type) => User, (user) => user.wallet)
  @JoinColumn()
  user: User;

  @OneToMany((type) => Transaction, (transaction) => transaction.wallet)
  transaction: Transaction[];

  @OneToOne((type) => Card, (card) => card.wallet)
  card: Card;

  toJSON() {
    return {
      account_number: this.account_number,
      deposit_address: this.deposit_address,
      currency: this.currency,
    };
  }
}
