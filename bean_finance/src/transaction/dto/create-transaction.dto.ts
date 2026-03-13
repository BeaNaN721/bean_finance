import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { TransactionType } from "../entities/transaction.entity";

export class CreateTransactionDto {
  @IsInt()
  @Min(1, { message: '金额必须大于0, 且单位为分' })
  amount: number;

  @IsEnum(TransactionType, { message: '类型只能是 income 或 expense' })
  type: TransactionType;

  @IsNotEmpty({ message: '分类不能为空' })
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsDateString({}, { message: '日期格式不正确, 请输入ISO格式字符串' })
  recordedAt: Date;
}
