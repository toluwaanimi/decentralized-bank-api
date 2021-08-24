import { AbstractEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Wallet } from './wallet.entity';
import { PaymentStatus } from '../common/constants/payment.constants';

@Entity('transactions')
export class Transaction extends AbstractEntity {
  @Column({
    nullable: true,
    default: 0,
    type: 'decimal',
    precision: 20,
    scale: 8,
  })
  amount: number;

  @Column({ default: false })
  status: boolean;
  @Column({ nullable: true, default: PaymentStatus.pending })
  tx_status: PaymentStatus;

  @Column({ nullable: true })
  txn_type: 'credit' | 'debit';

  @Column()
  channel: string;

  @Column({ array: false, type: 'json', default: {} })
  metadata: any;

  @ManyToOne((type) => User, (user) => user.transaction)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @ManyToOne((type) => Wallet, (wallet) => wallet.transaction)
  @JoinColumn()
  wallet: Wallet;

  @Column()
  walletId: string;
}
