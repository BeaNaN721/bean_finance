import axios from 'axios';

export interface Transaction {
  id?: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note?: string;
  recordedAt: string | Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

export const getTransactions = (page = 1, limit = 20) => 
  api.get<PaginatedResponse<Transaction>>('/transaction', { params: { page, limit } });

export const exportCsv = () => 
  api.get('/transaction/export/csv', { responseType: 'blob' });

export const addTransaction = (data: any) => api.post('/transaction', data);

export const deleteTransaction = (id: number) => api.delete(`/transaction/${id}`);

export const getTransaction = (id: number) => api.get(`/transaction/${id}`);

export const updateTransaction = (id: number, data: Partial<Transaction>) => api.patch(`/transaction/${id}`, data);