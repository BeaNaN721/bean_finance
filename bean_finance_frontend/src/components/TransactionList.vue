<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Transaction } from '../api/transaction';
import Pagination from './Pagination.vue';

const props = defineProps<{
  list: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  (e: 'delete', id: number): void;
  (e: 'edit', item: Transaction): void;
  (e: 'refresh'): void;
  (e: 'pageChange', page: number): void;
  (e: 'export'): void;
  (e: 'import', file: File): void;
}>();

const categories = {
  expense: ['餐饮', '交通', '购物', '娱乐', '住房', '医疗', '教育', '通讯', '其他'],
  income: ['工资', '奖金', '投资', '其他']
};

const toYuan = (fen: number) => (fen / 100).toFixed(2);

const formatTime = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', { 
    timeZone: 'Asia/Shanghai',
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const filters = ref({
  type: '' as '' | 'income' | 'expense',
  category: '',
  startDate: '',
  endDate: ''
});

const filteredList = computed(() => {
  return props.list.filter(item => {
    if (filters.value.type && item.type !== filters.value.type) return false;
    if (filters.value.category && item.category !== filters.value.category) return false;
    if (filters.value.startDate) {
      const itemDate = new Date(item.recordedAt).toISOString().slice(0, 10);
      if (itemDate < filters.value.startDate) return false;
    }
    if (filters.value.endDate) {
      const itemDate = new Date(item.recordedAt).toISOString().slice(0, 10);
      if (itemDate > filters.value.endDate) return false;
    }
    return true;
  });
});

const clearFilters = () => {
  filters.value = { type: '', category: '', startDate: '', endDate: '' };
};

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    emit('import', file);
    (event.target as HTMLInputElement).value = '';
  }
};

const handleDelete = (id: number | undefined) => {
  if (!id) return;
  if (!confirm('确定要删除这条记账记录吗？')) return;
  emit('delete', id);
};
</script>

<template>
  <section class="section-box">
    <h3>账单列表</h3>
    
    <div class="filter-row">
      <div class="filter-item">
        <label>类型</label>
        <select v-model="filters.type">
          <option value="">全部类型</option>
          <option value="income">收入</option>
          <option value="expense">支出</option>
        </select>
      </div>
      <div class="filter-item">
        <label>分类</label>
        <select v-model="filters.category">
          <option value="">全部分类</option>
          <optgroup label="支出">
            <option v-for="cat in categories.expense" :key="cat" :value="cat">{{ cat }}</option>
          </optgroup>
          <optgroup label="收入">
            <option v-for="cat in categories.income" :key="cat" :value="cat">{{ cat }}</option>
          </optgroup>
        </select>
      </div>
    </div>
    <div class="filter-row">
      <div class="filter-item">
        <label>开始日期</label>
        <input v-model="filters.startDate" type="date" />
      </div>
      <div class="filter-item">
        <label>结束日期</label>
        <input v-model="filters.endDate" type="date" />
      </div>
      <div class="filter-item" style="display: flex; align-items: flex-end; gap: 8px;">
        <button @click="clearFilters" style="padding: 8px 16px; font-size: 12px;">清除</button>
        <button @click="$emit('refresh')" style="padding: 8px 16px; font-size: 12px;">刷新</button>
      </div>
    </div>
    
    <div class="action-row">
      <button @click="$emit('export')" class="btn-export">导出CSV</button>
      <label class="btn-import">
        导入CSV
        <input type="file" accept=".csv" @change="handleFileChange" hidden />
      </label>
    </div>
    
    <ul>
      <li v-for="item in filteredList" :key="item.id">
        <div class="record-info">
          <strong>{{ item.category }}</strong> <br/>
          <small>{{ formatTime(item.recordedAt) }} - {{ item.note }}</small>
        </div>
        <span :style="{color: item.type === 'expense' ? '#c0392b' : '#27ae60', fontWeight: 'bold'}">
          {{ item.type === 'expense' ? '-' : '+' }}{{ toYuan(item.amount) }}
        </span>
        <button @click="$emit('edit', item)" class="btn-edit" style="margin-left: 15px;">编辑</button>
        <button @click="handleDelete(item.id)" class="btn-delete" style="margin-left: 5px;">删除</button>
      </li>
    </ul>
    
    <Pagination 
      :current="page" 
      :total="total" 
      :page-size="pageSize"
      @change="(p) => $emit('pageChange', p)"
    />
  </section>
</template>

<style scoped>
.section-box {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ffe4e9;
  margin-bottom: 25px;
}

h3 {
  color: #ff69b4;
  margin-top: 0;
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 100px;
}

.filter-item label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.filter-item select, .filter-item input {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 2px solid #ffe4e9;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
  font-size: 14px;
}

.filter-item select:focus, .filter-item input:focus {
  outline: none;
  border-color: #ff69b4;
}

ul { list-style: none; padding: 0; }
li {
  padding: 15px;
  border-bottom: 1px solid #ffe4e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s;
}
li:hover { background: #fff0f5; }
.record-info { flex: 1; }

button {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  color: white;
  font-weight: 500;
  transition: all 0.3s;
}

button.btn-delete { 
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa5a5 100%);
  padding: 5px 12px; 
  font-size: 12px; 
}

button.btn-edit { 
  background: linear-gradient(135deg, #ffa500 0%, #ffd700 100%);
  padding: 5px 12px; 
  font-size: 12px; 
}

.action-row {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.btn-export, .btn-import {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  color: white;
  background: linear-gradient(135deg, #3498db 0%, #5dade2 100%);
  border: none;
  display: inline-block;
}

.btn-import {
  background: linear-gradient(135deg, #9b59b6 0%, #bb8fce 100%);
}
</style>