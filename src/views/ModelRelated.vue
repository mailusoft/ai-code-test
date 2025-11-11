<template>
  <div class="page-container">
    <!-- 返回首页按钮 -->
    <div class="back-home-btn" @click="goHome" title="返回首页">
      <span class="back-icon">←</span>
      <span class="back-text">返回首页</span>
    </div>
    <div class="page-content">
      <div class="empty-content">
        <div class="empty-icon">🔧</div>
        <h2>模型相关模块</h2>
        <p>功能开发中...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModelRelated',
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.page-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.back-home-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
}

.back-home-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.back-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.back-home-btn:hover .back-icon {
  transform: translateX(-4px);
}

.page-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-content {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-content h2 {
  margin: 0 0 16px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 32px;
  font-weight: 600;
}

.empty-content p {
  margin: 0;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
