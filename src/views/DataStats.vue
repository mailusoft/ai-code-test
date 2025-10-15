<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>📈 数据统计模块</h1>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ totalRecords }}</span>
          <span class="stat-label">累计数据量</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ growthRate }}%</span>
          <span class="stat-label">数据增长率</span>
        </div>
      </div>
    </div>

    <div class="page-content">
      <div class="stats-dashboard">
        <!-- 内容已全部清空 -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataStats',
  data() {
    return {
      totalRecords: 15420,
      growthRate: 12.5,
      avgEfficiency: 87.3,
      maintenanceCount: 156
    }
  }
}
</script>

<style scoped>
.page-container {
  width: calc(100vw - 280px);
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.header-content {
  position: relative;
  z-index: 1;
}

.page-header h1 {
  margin: 0;
  color: white;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header-stats {
  display: flex;
  gap: 30px;
  position: relative;
  z-index: 1;
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.page-content {
  flex: 1;
  padding: 40px 30px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.page-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.stats-dashboard {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.primary {
  border-left: 4px solid #667eea;
}

.stat-card.success {
  border-left: 4px solid #28a745;
}

.stat-card.warning {
  border-left: 4px solid #ffc107;
}

.stat-card.info {
  border-left: 4px solid #17a2b8;
}

.stat-icon {
  font-size: 32px;
  opacity: 0.8;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.chart-container h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.trend-chart {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trend-svg {
  width: 100%;
  height: 100%;
}

.pie-chart {
  display: flex;
  align-items: center;
  gap: 24px;
}

.pie-segments {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    #667eea 0% 35%,
    #28a745 35% 60%,
    #ffc107 60% 80%,
    #dc3545 80% 100%
  );
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-segments::after {
  content: '';
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  position: absolute;
}

.pie-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  display: inline-block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 20px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .header-stats {
    gap: 20px;
  }

  .page-content {
    padding: 30px 20px;
  }

  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>
