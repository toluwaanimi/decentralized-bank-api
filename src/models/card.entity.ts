import { AbstractEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Wallet } from './wallet.entity';

@Entity('cards')
export class Card extends AbstractEntity {
  @ManyToOne((type) => User, (user) => user)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @OneToOne((type) => Wallet, (wallet) => wallet.card)
  @JoinColumn()
  wallet: Wallet;

  @Column()
  walletId: string;

  @Column()
  card_number: string;

  @Column()
  card_expire_year: string;

  @Column()
  card_expire_month: string;

  @Column()
  card_cvv: string;

  @Column({ nullable: true })
  card_pin: string;
}
