<script setup lang="ts">
import { computed } from 'vue';
import type { Transaction } from '../api/transaction';

const props = defineProps<{
  list: Transaction[];
}>();

const toYuan = (fen: number) => (fen / 100).toFixed(2);

const totalIncome = computed(() => {
  return props.list
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0);
});

const totalExpense = computed(() => {
  return props.list
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount), 0);
});

const totalBalance = computed(() => {
  return props.list.reduce((sum, item) => {
    const amount = Number(item.amount);
    return item.type === 'expense' ? sum - amount : sum + amount;
  }, 0);
});

const categoryStats = computed(() => {
  const stats: Record<string, number> = {};
  props.list.forEach(item => {
    const cat = item.category;
    stats[cat] = (stats[cat] || 0) + Number(item.amount);
  });
  return Object.entries(stats)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
});
</script>

<template>
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

ul { list-style: none; padding: 0; }

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