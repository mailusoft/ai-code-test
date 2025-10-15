<template>
  <div class="module-content">
    <div class="module-header">
      <h2>📊 数据展示模块</h2>
      <p class="module-description">展示各类数据的可视化图表和报表</p>
    </div>

    <div class="content-grid">
      <div class="content-card">
        <h3>实时数据面板</h3>
        <div class="data-placeholder">
          <p>📈 这里将显示实时数据图表</p>
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div class="bar" style="height: 60%"></div>
              <div class="bar" style="height: 80%"></div>
              <div class="bar" style="height: 45%"></div>
              <div class="bar" style="height: 90%"></div>
              <div class="bar" style="height: 70%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-card">
        <h3>数据概览</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">1,234</div>
            <div class="stat-label">总记录数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">89%</div>
            <div class="stat-label">数据完整度</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">156</div>
            <div class="stat-label">活跃数据源</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataDisplayModule'
}
</script>

<style scoped>
.module-content {
  padding: 24px;
}

.module-header {
  margin-bottom: 32px;
}

.module-header h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.module-description {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.content-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
}

.content-card h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.data-placeholder {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.chart-placeholder {
  margin-top: 20px;
}

.chart-bars {
  display: flex;
  justify-content: center;
  align-items: end;
  height: 120px;
  gap: 8px;
}

.bar {
  width: 20px;
  background: linear-gradient(to top, #667eea, #764ba2);
  border-radius: 2px 2px 0 0;
  transition: all 0.3s ease;
  animation: barGrow 1s ease-out;
}

@keyframes barGrow {
  from {
    height: 0;
  }
  to {
    height: var(--bar-height, 60%);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}
</style>
