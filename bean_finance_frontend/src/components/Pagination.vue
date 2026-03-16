<script setup lang="ts">
defineProps<{
  current: number;
  total: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  (e: 'change', page: number): void;
}>();
</script>

<template>
  <div class="pagination">
    <button 
      :disabled="current <= 1" 
      @click="emit('change', current - 1)"
    >
      上一页
    </button>
    <span class="page-info">{{ current }} / {{ Math.ceil(total / pageSize) || 1 }}</span>
    <button 
      :disabled="current * pageSize >= total" 
      @click="emit('change', current + 1)"
    >
      下一页
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.page-info {
  color: #666;
  font-size: 14px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  background: linear-gradient(135deg, #ff69b4 0%, #ffb6c1 100%);
  color: white;
  font-size: 14px;
  transition: all 0.3s;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.3);
}
</style>