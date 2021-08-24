import { AbstractEntity } from './base.entity';
import { Column, Entity, Generated, OneToMany } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';
import { Card } from './card.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ nullable: true })
  username: string;

  @Column()
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  password: string;

  @Column({ default: false })
  is_verified: boolean;

  @Generated('increment')
  @Column()
  custom_id: number;

  @OneToMany((type) => Wallet, (wallet) => wallet.user)
  wallet: Wallet[];

  @OneToMany((type) => Transaction, (transaction) => transaction.user)
  transaction: Transaction[];

  @OneToMany((type) => Card, (card) => card.user)
  card: Card[];
}
