import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum TransactionType {
  INCOME = 'income',
  EXPENCE = 'expense',
}

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })//单位为分, 一定是整数
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ length: 50 })
  category: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'timestamp' })
  recordedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
