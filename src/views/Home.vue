<template>
  <div class="home-container">
    <div class="home-content">
      <!-- 标题区域 -->
      <div class="home-header">
        <h1 class="main-title">AI 智能冷试数据分析与异常预警系统</h1>
        <p class="subtitle">Engine Data Analysis and Anomaly Warning System</p>
      </div>

      <!-- 模块导航卡片 -->
      <div class="modules-grid">
        <div 
          v-for="module in modules" 
          :key="module.path"
          class="module-card"
          @click="navigateTo(module.path)"
        >
          <div class="card-icon">{{ module.icon }}</div>
          <div class="card-content">
            <h3 class="card-title">{{ module.title }}</h3>
            <p class="card-description">{{ module.description }}</p>
          </div>
          <div class="card-arrow">→</div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="home-footer">
        <p class="footer-text">选择上方模块进入对应功能页面</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      modules: [
        {
          path: '/data-display',
          icon: '📊',
          title: '数据展示模块',
          description: '单台发动机详情数据展示与可视化'
        },
        {
          path: '/engine-filter',
          icon: '🔍',
          title: '发动机筛选模块',
          description: '多维度筛选和过滤发动机数据'
        },
        {
          path: '/data-stats',
          icon: '📈',
          title: '数据统计模块',
          description: '发动机数据分析与可视化统计'
        }
      ]
    }
  },
  methods: {
    navigateTo(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.home-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 背景动画效果 */
.home-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.home-content {
  width: 100%;
  max-width: 1400px;
  padding: 40px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.home-header {
  text-align: center;
  margin-bottom: 20px;
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 16px 0;
  text-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  letter-spacing: 2px;
}

.subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  letter-spacing: 1px;
  font-weight: 300;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
}

.module-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeInUp 0.8s ease-out;
  animation-fill-mode: both;
}

.module-card:nth-child(1) {
  animation-delay: 0.1s;
}

.module-card:nth-child(2) {
  animation-delay: 0.2s;
}

.module-card:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.module-card:hover::before {
  opacity: 1;
}

.module-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(102, 126, 234, 0.2);
}

.module-card:active {
  transform: translateY(-4px) scale(1.01);
}

.card-icon {
  font-size: 64px;
  line-height: 1;
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
  transition: transform 0.4s ease;
  position: relative;
  z-index: 1;
}

.module-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.card-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.card-title {
  font-size: 24px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 12px 0;
  transition: color 0.3s ease;
}

.module-card:hover .card-title {
  color: rgba(255, 255, 255, 1);
}

.card-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.module-card:hover .card-description {
  color: rgba(255, 255, 255, 0.8);
}

.card-arrow {
  font-size: 32px;
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.4s ease;
  position: relative;
  z-index: 1;
  align-self: flex-end;
}

.module-card:hover .card-arrow {
  color: rgba(102, 126, 234, 1);
  transform: translateX(8px);
}

.home-footer {
  text-align: center;
  margin-top: 20px;
  animation: fadeIn 1s ease-out 0.6s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.footer-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  letter-spacing: 1px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .modules-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .main-title {
    font-size: 40px;
  }
}

@media (max-width: 768px) {
  .home-content {
    padding: 20px;
    gap: 30px;
  }
  
  .main-title {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .modules-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .module-card {
    padding: 24px;
  }
  
  .card-icon {
    font-size: 48px;
  }
  
  .card-title {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 28px;
  }
  
  .module-card {
    padding: 20px;
  }
}
</style>

