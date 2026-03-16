import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) { }
  create(createTransactionDto: CreateTransactionDto) {
    const transaction = this.transactionRepo.create(createTransactionDto);
    return this.transactionRepo.save(transaction);
  }

  async findAll(page: number = 1, limit: number = 20) {
    const [data, total] = await this.transactionRepo.findAndCount({
      order: {recordedAt: 'DESC', createdAt: 'DESC'},
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async exportAll() {
    return this.transactionRepo.find({
      order: {recordedAt: 'DESC', createdAt: 'DESC'},
    });
  }

  findOne(id: number) {
    return this.transactionRepo.findOneBy({id});
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const { createdAt, ...data } = updateTransactionDto as any;
    return this.transactionRepo.update(id, data);
  }

  remove(id: number) {
    return this.transactionRepo.delete(id);
  }
}
