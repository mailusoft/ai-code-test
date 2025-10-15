<template>
  <div class="module-content">
    <div class="module-header">
      <h2>📈 数据统计模块</h2>
      <p class="module-description">提供各类数据的统计分析和趋势报告</p>
    </div>

    <div class="stats-dashboard">
      <div class="stats-overview">
        <div class="stat-card primary">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <div class="stat-number">{{ totalRecords }}</div>
            <div class="stat-label">累计数据量</div>
          </div>
        </div>
        <div class="stat-card success">
          <div class="stat-icon">📈</div>
          <div class="stat-info">
            <div class="stat-number">{{ growthRate }}%</div>
            <div class="stat-label">数据增长率</div>
          </div>
        </div>
        <div class="stat-card warning">
          <div class="stat-icon">⚡</div>
          <div class="stat-info">
            <div class="stat-number">{{ avgEfficiency }}%</div>
            <div class="stat-label">平均效率</div>
          </div>
        </div>
        <div class="stat-card info">
          <div class="stat-icon">🔧</div>
          <div class="stat-info">
            <div class="stat-number">{{ maintenanceCount }}</div>
            <div class="stat-label">维护事件</div>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-container">
          <h3>数据增长趋势</h3>
          <div class="trend-chart">
            <div class="chart-line">
              <svg viewBox="0 0 300 150" class="trend-svg">
                <polyline
                  points="20,120 60,100 100,80 140,60 180,70 220,50 260,40 280,30"
                  stroke="#667eea"
                  stroke-width="3"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle cx="20" cy="120" r="4" fill="#667eea"/>
                <circle cx="280" cy="30" r="4" fill="#667eea"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <h3>效率分布</h3>
          <div class="pie-chart">
            <div class="pie-segments">
              <div class="segment" style="--percentage: 35%; --color: #667eea;"></div>
              <div class="segment" style="--percentage: 25%; --color: #28a745;"></div>
              <div class="segment" style="--percentage: 20%; --color: #ffc107;"></div>
              <div class="segment" style="--percentage: 20%; --color: #dc3545;"></div>
            </div>
            <div class="pie-legend">
              <div class="legend-item">
                <span class="legend-color" style="background: #667eea;"></span>
                <span>优秀 (35%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #28a745;"></span>
                <span>良好 (25%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #ffc107;"></span>
                <span>一般 (20%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #dc3545;"></span>
                <span>需改进 (20%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataStatsModule',
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

.stats-dashboard {
  display: flex;
  flex-direction: column;
  gap: 32px;
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
</style>
