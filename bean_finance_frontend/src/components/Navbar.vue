<script setup lang="ts">
defineProps<{
  balance: number;
  currentView: 'home' | 'stats' | 'settings';
}>();

defineEmits<{
  (e: 'switch', view: 'home' | 'stats' | 'settings'): void;
}>();

const toYuan = (fen: number) => (fen / 100).toFixed(2);
</script>

<template>
  <nav class="navbar">
    <div class="nav-brand">💰 记账软件</div>
    <div class="nav-balance" :style="{ color: balance >= 0 ? '#27ae60' : '#c0392b' }">
      {{ toYuan(balance) }} 元
    </div>
    <div class="nav-links">
      <a href="#" class="nav-item" :class="{ active: currentView === 'home' }" @click.prevent="$emit('switch', 'home')">首页</a>
      <a href="#" class="nav-item" :class="{ active: currentView === 'stats' }" @click.prevent="$emit('switch', 'stats')">统计</a>
      <a href="#" class="nav-item" :class="{ active: currentView === 'settings' }" @click.prevent="$emit('switch', 'settings')">设置</a>
    </div>
  </nav>
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
</style>