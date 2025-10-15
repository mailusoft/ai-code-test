<template>
  <div class="module-content">
    <div class="module-header">
      <h2>🔧 模型相关模块</h2>
      <p class="module-description">管理各种预测模型和算法配置</p>
    </div>

    <div class="models-grid">
      <div class="model-card">
        <div class="model-header">
          <h3>发动机寿命预测模型</h3>
          <span class="model-status active">运行中</span>
        </div>
        <div class="model-info">
          <p class="model-description">基于历史数据和实时监测，预测发动机剩余使用寿命。</p>
          <div class="model-metrics">
            <div class="metric">
              <span class="metric-label">准确率：</span>
              <span class="metric-value">94.2%</span>
            </div>
            <div class="metric">
              <span class="metric-label">更新频率：</span>
              <span class="metric-value">实时</span>
            </div>
            <div class="metric">
              <span class="metric-label">数据源：</span>
              <span class="metric-value">传感器 + 历史记录</span>
            </div>
          </div>
        </div>
        <div class="model-actions">
          <button class="btn btn-primary">查看详情</button>
          <button class="btn btn-secondary">配置参数</button>
        </div>
      </div>

      <div class="model-card">
        <div class="model-header">
          <h3>故障诊断模型</h3>
          <span class="model-status training">训练中</span>
        </div>
        <div class="model-info">
          <p class="model-description">利用机器学习算法，提前识别潜在的发动机故障。</p>
          <div class="model-metrics">
            <div class="metric">
              <span class="metric-label">准确率：</span>
              <span class="metric-value">91.8%</span>
            </div>
            <div class="metric">
              <span class="metric-label">训练进度：</span>
              <span class="metric-value">78%</span>
            </div>
            <div class="metric">
              <span class="metric-label">样本量：</span>
              <span class="metric-value">15,000+</span>
            </div>
          </div>
        </div>
        <div class="model-actions">
          <button class="btn btn-primary">监控训练</button>
          <button class="btn btn-secondary">模型调优</button>
        </div>
      </div>

      <div class="model-card">
        <div class="model-header">
          <h3>燃油效率优化模型</h3>
          <span class="model-status inactive">待激活</span>
        </div>
        <div class="model-info">
          <p class="model-description">优化发动机运行参数，提高燃油效率并降低排放。</p>
          <div class="model-metrics">
            <div class="metric">
              <span class="metric-label">预期提升：</span>
              <span class="metric-value">8-12%</span>
            </div>
            <div class="metric">
              <span class="metric-label">适用机型：</span>
              <span class="metric-value">B737, A320系列</span>
            </div>
            <div class="metric">
              <span class="metric-label">验证状态：</span>
              <span class="metric-value">实验室测试</span>
            </div>
          </div>
        </div>
        <div class="model-actions">
          <button class="btn btn-success">激活模型</button>
          <button class="btn btn-secondary">查看文档</button>
        </div>
      </div>
    </div>

    <div class="model-management">
      <h3>模型管理工具</h3>
      <div class="management-actions">
        <button class="btn btn-primary">新建模型</button>
        <button class="btn btn-secondary">导入模型</button>
        <button class="btn btn-warning">批量操作</button>
        <button class="btn btn-info">性能报告</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModelRelatedModule'
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

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.model-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.model-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.model-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.model-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.model-status.active {
  background: #d4edda;
  color: #155724;
}

.model-status.training {
  background: #fff3cd;
  color: #856404;
}

.model-status.inactive {
  background: #e2e3e5;
  color: #383d41;
}

.model-info {
  margin-bottom: 20px;
}

.model-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.model-metrics {
  display: grid;
  gap: 8px;
}

.metric {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.metric-label {
  color: #888;
}

.metric-value {
  color: #2c3e50;
  font-weight: 500;
}

.model-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.model-management {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.model-management h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.management-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover {
  background: #138496;
}
</style>
