<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getTransactions, addTransaction, deleteTransaction, updateTransaction, type Transaction } from './api/transaction';

const list = ref<Transaction[]>([]);
const editingItem = ref<Transaction | null>(null);
const showEditDialog = ref(false);
const currentView = ref<'home' | 'stats' | 'settings'>('home');

const categories = {
  expense: ['餐饮', '交通', '购物', '娱乐', '住房', '医疗', '教育', '通讯', '其他'],
  income: ['工资', '奖金', '投资', '其他']
};

const toFen = (yuan: number) => Math.round(yuan * 100);
const toYuan = (fen: number) => (fen / 100).toFixed(2);
const getLocalDateTime = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
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

const form = ref({
  amount: 0,
  type: 'expense' as const,
  category: '',
  note: '',
  recordedAt: getLocalDateTime()
});

const loadData = async () => {
  const res = await getTransactions();
  list.value = res.data;
};

const filters = ref({
  type: '' as '' | 'income' | 'expense',
  category: '',
  startDate: '',
  endDate: ''
});

const filteredList = computed(() => {
  return list.value.filter(item => {
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

const handleSave = async () => {
  if (!form.value.category || form.value.amount <= 0) {
    alert("请输入分类和金额！");
    return;
  }
  
  try {
    await addTransaction({
      ...form.value,
      amount: toFen(form.value.amount)
    } as Transaction);
    alert('记账成功！');
    form.value.category = '';
    form.value.note = '';
    await loadData();
  } catch (err) {
    console.error("提交失败:", err);
  }
};

const handleDelete = async (id: number | undefined) => {
  if (!id) return;
  if (!confirm('确定要删除这条记账记录吗？')) return;
  
  try {
    await deleteTransaction(id);
    alert('删除成功');
    await loadData();
  } catch (err) {
    console.error("删除失败:", err);
  }
};

const handleEdit = (item: Transaction) => {
  const d = new Date(item.recordedAt);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  editingItem.value = { 
    ...item, 
    amount: toYuan(item.amount) as any,
    recordedAt: d.toISOString().slice(0, 16)
  };
  showEditDialog.value = true;
};

const handleUpdate = async () => {
  if (!editingItem.value || !editingItem.value.id) return;
  if (!editingItem.value.category || editingItem.value.amount <= 0) {
    alert("请输入分类和金额！");
    return;
  }
  
  try {
    const { createdAt, id, ...data } = editingItem.value;
    await updateTransaction(id, {
      ...data,
      amount: toFen(Number(data.amount))
    });
    alert('更新成功！');
    showEditDialog.value = false;
    await loadData();
  } catch (err) {
    console.error("更新失败:", err);
  }
};

const handleCancel = () => {
  showEditDialog.value = false;
  editingItem.value = null;
};

const totalBalance = computed(() => {
  return list.value.reduce((sum, item) => {
    const amount = Number(item.amount);
    return item.type === 'expense' ? sum - amount : sum + amount;
  }, 0);
});

const totalIncome = computed(() => {
  return list.value
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0);
});

const totalExpense = computed(() => {
  return list.value
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount), 0);
});

const categoryStats = computed(() => {
  const stats: Record<string, number> = {};
  list.value.forEach(item => {
    const cat = item.category;
    stats[cat] = (stats[cat] || 0) + Number(item.amount);
  });
  return Object.entries(stats)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
});

const switchView = (view: 'home' | 'stats' | 'settings') => {
  currentView.value = view;
};

onMounted(loadData);
</script>

<template>
  <div class="app-wrapper">
    <nav class="navbar">
      <div class="nav-brand">💰 记账软件</div>
      <div class="nav-balance" :style="{ color: totalBalance >= 0 ? '#27ae60' : '#c0392b' }">
        {{ toYuan(totalBalance) }} 元
      </div>
      <div class="nav-links">
        <a href="#" class="nav-item" :class="{ active: currentView === 'home' }" @click.prevent="switchView('home')">首页</a>
        <a href="#" class="nav-item" :class="{ active: currentView === 'stats' }" @click.prevent="switchView('stats')">统计</a>
        <a href="#" class="nav-item" :class="{ active: currentView === 'settings' }" @click.prevent="switchView('settings')">设置</a>
      </div>
    </nav>
    
    <div class="container">
      <!-- 首页 -->
      <template v-if="currentView === 'home'">
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
            <button @click="handleSave" style="width: 100%;">提交记账</button>
          </div>
        </div>
      </section>

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
            <button @click="loadData" style="padding: 8px 16px; font-size: 12px;">刷新</button>
          </div>
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
            <button @click="handleEdit(item)" class="btn-edit" style="margin-left: 15px;">编辑</button>
            <button @click="handleDelete(item.id)" class="btn-delete" style="margin-left: 5px;">删除</button>
          </li>
        </ul>
      </section>
      </template>

      <section v-if="showEditDialog && editingItem" class="dialog-overlay" @click.self="handleCancel">
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
            <button @click="handleUpdate">保存</button>
            <button @click="handleCancel" style="background: #95a5a6;">取消</button>
          </div>
        </div>
      </section>

      <!-- 统计页面 -->
      <template v-if="currentView === 'stats'">
        <section class="section-box">
          <h3>收支概览</h3>
          <div class="stats-grid">
            <div class="stats-card income">
              <div class="stats-label">总收入</div>
              <div class="stats-value">+{{ toYuan(totalIncome) }} 元</div>
            </div>
            <div class="stats-card expense">
              <div class="stats-label">总支出</div>
              <div class="stats-value">-{{ toYuan(totalExpense) }} 元</div>
            </div>
            <div class="stats-card balance" :class="{ negative: totalBalance < 0 }">
              <div class="stats-label">结余</div>
              <div class="stats-value">{{ toYuan(totalBalance) }} 元</div>
            </div>
          </div>
        </section>

        <section class="section-box">
          <h3>分类统计</h3>
          <ul>
            <li v-for="stat in categoryStats" :key="stat.category" class="stats-item">
              <span>{{ stat.category }}</span>
              <span class="stats-amount">{{ toYuan(stat.amount) }} 元</span>
            </li>
          </ul>
        </section>
      </template>

      <!-- 设置页面 -->
      <template v-if="currentView === 'settings'">
        <section class="section-box">
          <h3>关于</h3>
          <p>记账软件 v1.0.0</p>
          <p>由 NestJS + Vue 构建</p>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%);
  box-shadow: 0 2px 10px rgba(255, 182, 193, 0.5);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.nav-balance {
  font-size: 18px;
  font-weight: bold;
  background: rgba(255,255,255,0.9);
  padding: 8px 20px;
  border-radius: 20px;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-item {
  color: rgba(255,255,255,0.9);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
}

.nav-item:hover, .nav-item.active {
  background: rgba(255,255,255,0.3);
  color: #fff;
}

.app-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff0f5 0%, #ffe4e9 100%);
  padding: 0;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 10px 30px rgba(255, 182, 193, 0.3);
}

h1 { text-align: center; color: #ff69b4; margin-top: 0; }

.section-box {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ffe4e9;
  margin-bottom: 25px;
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
  padding: 8px;
  font-size: 14px;
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
button.btn-delete { 
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa5a5 100%);
  padding: 5px 12px; 
  font-size: 12px; 
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

.dialog-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.dialog-buttons button { flex: 1; }

button.btn-edit { 
  background: linear-gradient(135deg, #ffa500 0%, #ffd700 100%);
  padding: 5px 12px; 
  font-size: 12px; 
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stats-card {
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.stats-card.income {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
}

.stats-card.expense {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
}

.stats-card.balance {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
}

.stats-card.balance.negative {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
}

.stats-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stats-value {
  font-size: 20px;
  font-weight: bold;
}

.stats-card.income .stats-value { color: #27ae60; }
.stats-card.expense .stats-value { color: #c0392b; }
.stats-card.balance .stats-value { color: #27ae60; }
.stats-card.balance.negative .stats-value { color: #c0392b; }

.stats-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #ffe4e9;
}

.stats-amount {
  font-weight: bold;
  color: #ff69b4;
}
</style>