<template>
  <div class="module-content">
    <div class="module-header">
      <h2>🔍 发动机筛选模块</h2>
      <p class="module-description">根据各种条件筛选和过滤发动机数据</p>
    </div>

    <div class="filter-panel">
      <div class="filter-section">
        <h3>基本筛选条件</h3>
        <div class="filter-grid">
          <div class="filter-item">
            <label>发动机型号：</label>
            <select class="filter-select">
              <option>全部</option>
              <option>CFM56-5B</option>
              <option>CFM56-7B</option>
              <option>GE90</option>
              <option>Trent 900</option>
            </select>
          </div>
          <div class="filter-item">
            <label>制造商：</label>
            <select class="filter-select">
              <option>全部</option>
              <option>CFM International</option>
              <option>General Electric</option>
              <option>Rolls-Royce</option>
              <option>Pratt & Whitney</option>
            </select>
          </div>
          <div class="filter-item">
            <label>推力范围：</label>
            <select class="filter-select">
              <option>全部</option>
              <option>20,000-30,000 lbs</option>
              <option>30,000-50,000 lbs</option>
              <option>50,000-80,000 lbs</option>
              <option>80,000+ lbs</option>
            </select>
          </div>
        </div>
      </div>

      <div class="filter-section">
        <h3>高级筛选条件</h3>
        <div class="filter-grid">
          <div class="filter-item">
            <label>安装位置：</label>
            <select class="filter-select">
              <option>全部</option>
              <option>翼吊</option>
              <option>尾吊</option>
              <option>机身安装</option>
            </select>
          </div>
          <div class="filter-item">
            <label>燃油效率等级：</label>
            <select class="filter-select">
              <option>全部</option>
              <option>A级 (最高)</option>
              <option>B级</option>
              <option>C级</option>
              <option>D级</option>
            </select>
          </div>
          <div class="filter-item">
            <label>维护状态：</label>
            <select class="filter-select">
              <option>全部</option>
              <option>正常运行</option>
              <option>需要维护</option>
              <option>维修中</option>
              <option>报废</option>
            </select>
          </div>
        </div>
      </div>

      <div class="filter-actions">
        <button class="btn btn-primary">应用筛选</button>
        <button class="btn btn-secondary">重置条件</button>
        <button class="btn btn-success">导出结果</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EngineFilterModule'
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

.filter-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.filter-section {
  margin-bottom: 32px;
}

.filter-section h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.filter-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
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
</style>
