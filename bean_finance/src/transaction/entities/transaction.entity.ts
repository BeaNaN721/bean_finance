import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum TransactionType {
  INCOME = 'income',
  EXPENCE = 'expense',
}

export enum Category {
  DINING = '餐饮',
  TRANSPORT = '交通',
  SHOPPING = '购物',
  ENTERTAINMENT = '娱乐',
  HOUSING = '住房',
  MEDICAL = '医疗',
  EDUCATION = '教育',
  COMMUNICATION = '通讯',
  SALARY = '工资',
  BONUS = '奖金',
  INVESTMENT = '投资',
  OTHER = '其他',
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
