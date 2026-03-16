<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getTransactions, addTransaction, deleteTransaction, updateTransaction, exportCsv, type Transaction } from './api/transaction';
import Navbar from './components/Navbar.vue';
import TransactionForm from './components/TransactionForm.vue';
import TransactionList from './components/TransactionList.vue';
import EditDialog from './components/EditDialog.vue';
import StatsView from './components/StatsView.vue';
import SettingsView from './components/SettingsView.vue';

const list = ref<Transaction[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const editingItem = ref<Transaction | null>(null);
const showEditDialog = ref(false);
const currentView = ref<'home' | 'stats' | 'settings'>('home');

const toFen = (yuan: number) => Math.round(yuan * 100);

const totalBalance = computed(() => {
  return list.value.reduce((sum, item) => {
    const amount = Number(item.amount);
    return item.type === 'expense' ? sum - amount : sum + amount;
  }, 0);
});

const loadData = async () => {
  try {
    const res = await getTransactions(page.value, pageSize.value);
    list.value = res.data.data;
    total.value = res.data.total;
  } catch (err) {
    console.error("加载失败:", err);
  }
};

const handlePageChange = (newPage: number) => {
  page.value = newPage;
  loadData();
};

const handleExport = async () => {
  try {
    const res = await exportCsv();
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    alert('导出成功！');
  } catch (err) {
    console.error("导出失败:", err);
  }
};

const handleImport = async (file: File) => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const text = e.target?.result as string;
    const lines = text.split('\n').slice(1);
    let successCount = 0;
    for (const line of lines) {
      const [id, amount, type, category, note, recordedAt] = line.split(',');
      if (amount && type && category) {
        try {
          await addTransaction({
            amount: parseInt(amount),
            type: type as 'income' | 'expense',
            category,
            note: note || '',
            recordedAt: recordedAt || new Date().toISOString(),
          });
          successCount++;
        } catch {}
      }
    }
    alert(`导入成功 ${successCount} 条记录`);
    loadData();
  };
  reader.readAsText(file);
};

const handleSubmit = async (data: { amount: number; type: 'expense' | 'income'; category: string; note: string; recordedAt: string }) => {
  try {
    await addTransaction({
      ...data,
      amount: toFen(data.amount)
    } as Transaction);
    alert('记账成功！');
    await loadData();
  } catch (err) {
    console.error("提交失败:", err);
  }
};

const handleDelete = async (id: number) => {
  try {
    await deleteTransaction(id);
    alert('删除成功');
    await loadData();
  } catch (err) {
    console.error("删除失败:", err);
  }
};

const handleEdit = (item: Transaction) => {
  editingItem.value = item;
  showEditDialog.value = true;
};

const handleUpdate = async (data: any) => {
  try {
    await updateTransaction(data.id, data);
    alert('更新成功！');
    showEditDialog.value = false;
    editingItem.value = null;
    await loadData();
  } catch (err) {
    console.error("更新失败:", err);
  }
};

const handleCancel = () => {
  showEditDialog.value = false;
  editingItem.value = null;
};

const switchView = (view: 'home' | 'stats' | 'settings') => {
  currentView.value = view;
};

onMounted(loadData);
</script>

<template>
  <div class="app-wrapper">
    <Navbar :balance="totalBalance" :current-view="currentView" @switch="switchView" />
    
    <div class="container">
      <!-- 首页 -->
      <template v-if="currentView === 'home'">
        <TransactionForm @submit="handleSubmit" />
        <TransactionList 
          :list="list" 
          :total="total"
          :page="page"
          :page-size="pageSize"
          @delete="handleDelete" 
          @edit="handleEdit"
          @refresh="loadData"
          @page-change="handlePageChange"
          @export="handleExport"
          @import="handleImport"
        />
      </template>

      <!-- 统计页面 -->
      <StatsView v-if="currentView === 'stats'" :list="list" />

      <!-- 设置页面 -->
      <SettingsView v-if="currentView === 'settings'" />
    </div>

    <EditDialog 
      :show="showEditDialog" 
      :item="editingItem"
      @update="handleUpdate"
      @cancel="handleCancel"
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
</style>