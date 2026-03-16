import axios from 'axios';

export interface Transaction {
  id?: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note?: string;
  recordedAt: string | Date;
}

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

export const getTransactions = () => api.get('/transaction');

export const addTransaction = (data: any) => api.post('/transaction', data);

export const deleteTransaction = (id: number) => api.delete(`/transaction/${id}`);

export const getTransaction = (id: number) => api.get(`/transaction/${id}`);

export const updateTransaction = (id: number, data: Partial<Transaction>) => api.patch(`/transaction/${id}`, data);