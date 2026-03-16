import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 20;
    return this.transactionService.findAll(p, l);
  }

  @Get('export/csv')
  async exportCsv(@Res() res: Response) {
    const data = await this.transactionService.exportAll();
    const headers = ['ID', '金额(分)', '类型', '分类', '备注', '记录日期', '创建时间'];
    const rows = data.map(item => [
      item.id,
      item.amount,
      item.type,
      item.category,
      item.note || '',
      item.recordedAt,
      item.createdAt,
    ]);
    
    const csv = '\uFEFF' + [headers, ...rows].map(row => row.join(',')).join('\n');
    
    res.setHeader('Content-Type', 'text/csv;charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
