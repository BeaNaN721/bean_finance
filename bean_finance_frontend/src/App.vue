<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getTransactions, addTransaction, type Transaction, deleteTransaction } from './api/transaction';

const list = ref<Transaction[]>([]);

// 表单默认值
const form = ref({
  amount: 0,
  type: 'expense' as const,
  category: '',
  note: '',
  recordedAt: new Date().toISOString().split('T')[0]
});

// 加载数据
const loadData = async () => {
  const res = await getTransactions();
  list.value = res.data;
};

// 提交数据
const handleSave = async () => {
  if (!form.value.category || form.value.amount <= 0) {
    alert("请输入分类和金额！");
    return;
  }
  
  try {
    await addTransaction(form.value as Transaction);
    alert('记账成功！');
    // 清空表单
    form.value.category = '';
    form.value.note = '';
    // 重新加载列表，让页面即时更新
    await loadData();
  } catch (err) {
    console.error("提交失败:", err);
  }
};

const handleDelete = async (id: number | undefined) => {
  if (!id) return;
  if (!confirm('确定要删除这条记账记录吗？')) return; // 简单的浏览器确认框
  
  try {
    await deleteTransaction(id);
    alert('删除成功');
    await loadData(); // 刷新列表
  } catch (err) {
    console.error("删除失败:", err);
  }
};

const totalBalance = computed(() => {
  return list.value.reduce((sum, item) => {
    // 支出为负，收入为正
    const amount = Number(item.amount);
    return item.type === 'expense' ? sum - amount : sum + amount;
  }, 0);
});

onMounted(loadData);
</script>

<template>
  <div class="app-wrapper">
  <div class="container">
    <h1>记账软件</h1>

    <div class="balance-card">
      <h2 :style="{ color: totalBalance >= 0 ? '#27ae60' : '#c0392b' }">
        余额: {{ (totalBalance / 100).toFixed(2) }} 元
      </h2>
    </div>

    <section class="section-box">
      <h3>记一笔账</h3>
      <div class="input-group"><input v-model="form.amount" type="number" placeholder="金额(分)" /></div>
      <div class="input-group">
        <select v-model="form.type">
          <option value="expense">支出</option>
          <option value="income">收入</option>
        </select>
      </div>
      <div class="input-group"><input v-model="form.category" placeholder="分类 (如: 餐饮)" /></div>
      <div class="input-group"><input v-model="form.note" placeholder="备注" /></div>
      <div class="input-group"><input v-model="form.recordedAt" type="date" /></div>
      <button @click="handleSave">提交记账</button>
    </section>

    <section class="section-box">
      <h3>账单列表 <button @click="loadData" style="font-size: 10px;">刷新</button></h3>
      <ul>
        <li v-for="item in list" :key="item.id">
          <div class="record-info">
            <strong>{{ item.category }}</strong> <br/>
            <small>{{ new Date(item.recordedAt).toISOString().split('T')[0] }} - {{ item.note }}</small>
          </div>
          <span :style="{color: item.type === 'expense' ? '#c0392b' : '#27ae60', fontWeight: 'bold'}">
            {{ item.type === 'expense' ? '-' : '+' }}{{ (Number(item.amount) / 100).toFixed(2) }}
          </span>
          <button @click="handleDelete(item.id)" class="btn-delete" style="margin-left: 15px;">删除</button>
        </li>
      </ul>
    </section>
  </div>
  </div>
</template>

<style scoped>
/* 让页面填满屏幕，并加上柔和渐变背景 */
.app-wrapper {
  min-height: 100vh;
  /* 柔和的浅色渐变：从左上角蓝紫色到右下角浅粉色 */
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

/* 你的主体卡片样式 */
.container {
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.85); /* 半透明白色，产生磨砂玻璃效果 */
  backdrop-filter: blur(10px); /* 磨砂玻璃特效 */
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* 深邃阴影 */
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* 标题样式 */
h1 { text-align: center; color: #2c3e50; }

/* 余额显示区域 */
.balance-card {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 25px;
}

/* 表单与列表区块 */
.section-box {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
  margin-bottom: 25px;
}

/* 表单输入元素 */
.input-group { margin-bottom: 15px; }
input, select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* 防止边框溢出 */
}

/* 按钮统一风格 */
button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #3498db;
  color: white;
  transition: background 0.3s;
}
button:hover { background: #2980b9; }
button.btn-delete { background: #e74c3c; padding: 5px 10px; font-size: 12px; }

/* 列表样式 */
ul { list-style: none; padding: 0; }
li {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.record-info { flex: 1; }
</style>