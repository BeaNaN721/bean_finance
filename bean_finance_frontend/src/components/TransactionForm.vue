<script setup lang="ts">
import { ref } from 'vue';

const categories = {
  expense: ['餐饮', '交通', '购物', '娱乐', '住房', '医疗', '教育', '通讯', '其他'],
  income: ['工资', '奖金', '投资', '其他']
};

const getLocalDateTime = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const form = ref({
  amount: 0,
  type: 'expense' as const,
  category: '',
  note: '',
  recordedAt: getLocalDateTime()
});

const emit = defineEmits<{
  (e: 'submit', data: { amount: number; type: 'expense' | 'income'; category: string; note: string; recordedAt: string }): void;
}>();

const handleSubmit = () => {
  if (!form.value.category || form.value.amount <= 0) {
    alert("请输入分类和金额！");
    return;
  }
  emit('submit', { ...form.value });
  form.value.category = '';
  form.value.note = '';
  form.value.recordedAt = getLocalDateTime();
};

defineExpose({ form });
</script>

<template>
  <section class="section-box">
    <h3>记一笔账</h3>
    <div class="form-row">
      <div class="input-group">
        <label>金额</label>
        <input v-model="form.amount" type="number" step="0.01" placeholder="金额(元)" />
      </div>
      <div class="input-group">
        <label>类型</label>
        <select v-model="form.type">
          <option value="expense">支出</option>
          <option value="income">收入</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="input-group">
        <label>分类</label>
        <select v-model="form.category">
          <option value="" disabled>选择分类</option>
          <optgroup label="支出">
            <option v-for="cat in categories.expense" :key="cat" :value="cat">{{ cat }}</option>
          </optgroup>
          <optgroup label="收入">
            <option v-for="cat in categories.income" :key="cat" :value="cat">{{ cat }}</option>
          </optgroup>
        </select>
      </div>
      <div class="input-group">
        <label>备注</label>
        <input v-model="form.note" placeholder="备注" />
      </div>
    </div>
    <div class="form-row">
      <div class="input-group">
        <label>日期</label>
        <input v-model="form.recordedAt" type="datetime-local" />
      </div>
      <div class="input-group">
        <label>&nbsp;</label>
        <button @click="handleSubmit" style="width: 100%;">提交记账</button>
      </div>
    </div>
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

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-row .input-group {
  flex: 1;
  margin-bottom: 0;
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

button {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  background: linear-gradient(135deg, #ff69b4 0%, #ffb6c1 100%);
  color: white;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(255, 105, 180, 0.3);
}

button:hover { 
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
}
</style>