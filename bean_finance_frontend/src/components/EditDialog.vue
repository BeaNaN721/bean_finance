<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Transaction } from '../api/transaction';

const props = defineProps<{
  show: boolean;
  item: Transaction | null;
}>();

const emit = defineEmits<{
  (e: 'update', data: any): void;
  (e: 'cancel'): void;
}>();

const categories = {
  expense: ['餐饮', '交通', '购物', '娱乐', '住房', '医疗', '教育', '通讯', '其他'],
  income: ['工资', '奖金', '投资', '其他']
};

const toYuan = (fen: number) => (fen / 100).toFixed(2);
const toFen = (yuan: number) => Math.round(yuan * 100);

const editingItem = ref<Transaction | null>(null);

watch(() => props.item, (newItem) => {
  if (newItem) {
    const d = new Date(newItem.recordedAt);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    editingItem.value = { 
      ...newItem, 
      amount: toYuan(newItem.amount) as any,
      recordedAt: d.toISOString().slice(0, 16)
    };
  }
}, { immediate: true });

const handleSave = () => {
  if (!editingItem.value || !editingItem.value.id) return;
  if (!editingItem.value.category || editingItem.value.amount <= 0) {
    alert("请输入分类和金额！");
    return;
  }
  
  const { createdAt, id, ...data } = editingItem.value;
  emit('update', {
    id,
    ...data,
    amount: toFen(Number(data.amount))
  });
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <section v-if="show && editingItem" class="dialog-overlay" @click.self="handleCancel">
    <div class="dialog">
      <h3>编辑记账</h3>
      <div class="input-group"><label>金额</label><input v-model="editingItem.amount" type="number" step="0.01" placeholder="金额(元)" /></div>
      <div class="input-group">
        <label>类型</label>
        <select v-model="editingItem.type">
          <option value="expense">支出</option>
          <option value="income">收入</option>
        </select>
      </div>
      <div class="input-group">
        <label>分类</label>
        <select v-model="editingItem.category">
          <option value="" disabled>选择分类</option>
          <optgroup label="支出">
            <option v-for="cat in categories.expense" :key="cat" :value="cat">{{ cat }}</option>
          </optgroup>
          <optgroup label="收入">
            <option v-for="cat in categories.income" :key="cat" :value="cat">{{ cat }}</option>
          </optgroup>
        </select>
      </div>
      <div class="input-group"><label>备注</label><input v-model="editingItem.note" placeholder="备注" /></div>
      <div class="input-group"><label>日期</label><input v-model="editingItem.recordedAt" type="datetime-local" /></div>
      <div class="dialog-buttons">
        <button @click="handleSave">保存</button>
        <button @click="handleCancel" style="background: #95a5a6;">取消</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 240, 245, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(255, 105, 180, 0.3);
}

h3 {
  color: #ff69b4;
  margin-top: 0;
  margin-bottom: 20px;
}

.input-group { margin-bottom: 15px; }
.input-group label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 2px solid #ffe4e9;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus, select:focus {
  outline: none;
  border-color: #ff69b4;
}

.dialog-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.dialog-buttons button { 
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  background: linear-gradient(135deg, #ff69b4 0%, #ffb6c1 100%);
  color: white;
  font-weight: 500;
  transition: all 0.3s;
}

.dialog-buttons button:hover { 
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
}
</style>