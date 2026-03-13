import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1111',
      database: 'finance_db',
      entities: [Transaction],
      synchronize: true,
      logging: true,
    }),
    TransactionModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
