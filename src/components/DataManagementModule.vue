<template>
  <div class="module-content">
    <div class="module-header">
      <h2>📋 数据管理模块</h2>
      <p class="module-description">管理、备份和维护各类数据资源</p>
    </div>

    <div class="management-tabs">
      <div class="tab-buttons">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="{ active: activeTab === tab.id }"
          class="tab-button"
        >
          {{ tab.name }}
        </button>
      </div>

      <div class="tab-content">
        <!-- 数据导入导出 -->
        <div v-if="activeTab === 'import-export'" class="tab-panel">
          <div class="panel-section">
            <h3>数据导入</h3>
            <div class="upload-area">
              <div class="upload-zone">
                <div class="upload-icon">📁</div>
                <p>拖拽文件到此处或点击选择文件</p>
                <input type="file" multiple accept=".csv,.xlsx,.json" class="file-input">
                <button class="btn btn-primary">选择文件</button>
              </div>
              <div class="upload-options">
                <label class="checkbox-item">
                  <input type="checkbox" checked>
                  <span>自动检测文件格式</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox">
                  <span>数据验证</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" checked>
                  <span>备份原数据</span>
                </label>
              </div>
            </div>
          </div>

          <div class="panel-section">
            <h3>数据导出</h3>
            <div class="export-options">
              <div class="option-group">
                <label>导出格式：</label>
                <select class="export-format">
                  <option>CSV</option>
                  <option>Excel</option>
                  <option>JSON</option>
                  <option>PDF报告</option>
                </select>
              </div>
              <div class="option-group">
                <label>数据范围：</label>
                <select class="data-range">
                  <option>全部数据</option>
                  <option>最近30天</option>
                  <option>最近90天</option>
                  <option>自定义范围</option>
                </select>
              </div>
              <button class="btn btn-success">开始导出</button>
            </div>
          </div>
        </div>

        <!-- 数据备份 -->
        <div v-if="activeTab === 'backup'" class="tab-panel">
          <div class="backup-status">
            <div class="status-card">
              <h4>自动备份</h4>
              <p class="status-text">每日凌晨2:00自动备份</p>
              <div class="status-indicator active"></div>
            </div>
            <div class="status-card">
              <h4>上次备份</h4>
              <p class="status-text">2024-01-15 02:00:00</p>
              <div class="status-indicator success"></div>
            </div>
            <div class="status-card">
              <h4>备份大小</h4>
              <p class="status-text">2.3 GB</p>
              <div class="status-indicator info"></div>
            </div>
          </div>

          <div class="backup-actions">
            <button class="btn btn-primary">立即备份</button>
            <button class="btn btn-secondary">备份设置</button>
            <button class="btn btn-warning">恢复数据</button>
          </div>
        </div>

        <!-- 数据清理 -->
        <div v-if="activeTab === 'cleanup'" class="tab-panel">
          <div class="cleanup-options">
            <div class="cleanup-item">
              <h4>清理临时文件</h4>
              <p>删除7天前的临时文件和缓存</p>
              <button class="btn btn-secondary">清理</button>
            </div>
            <div class="cleanup-item">
              <h4>清理无效数据</h4>
              <p>删除重复和无效的数据记录</p>
              <button class="btn btn-warning">清理</button>
            </div>
            <div class="cleanup-item">
              <h4>数据归档</h4>
              <p>将一年以上数据移至归档存储</p>
              <button class="btn btn-info">归档</button>
            </div>
          </div>
        </div>

        <!-- 用户权限 -->
        <div v-if="activeTab === 'permissions'" class="tab-panel">
          <div class="permissions-table">
            <div class="table-header">
              <span>用户</span>
              <span>角色</span>
              <span>权限</span>
              <span>操作</span>
            </div>
            <div class="table-row" v-for="user in users" :key="user.id">
              <span>{{ user.name }}</span>
              <span>{{ user.role }}</span>
              <span>{{ user.permissions }}</span>
              <div class="row-actions">
                <button class="btn btn-sm btn-primary">编辑</button>
                <button class="btn btn-sm btn-danger">删除</button>
              </div>
            </div>
          </div>
          <button class="btn btn-success">添加用户</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataManagementModule',
  data() {
    return {
      activeTab: 'import-export',
      tabs: [
        { id: 'import-export', name: '导入导出' },
        { id: 'backup', name: '数据备份' },
        { id: 'cleanup', name: '数据清理' },
        { id: 'permissions', name: '权限管理' }
      ],
      users: [
        { id: 1, name: '管理员', role: '超级管理员', permissions: '全部权限' },
        { id: 2, name: '分析师', role: '数据分析师', permissions: '只读权限' },
        { id: 3, name: '工程师', role: '维护工程师', permissions: '读写权限' }
      ]
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

.management-tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tab-buttons {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.tab-button {
  flex: 1;
  padding: 16px 20px;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  background: #e9ecef;
  color: #495057;
}

.tab-button.active {
  background: white;
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  padding: 24px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel-section {
  margin-bottom: 32px;
}

.panel-section h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 20px;
}

.upload-zone {
  margin-bottom: 20px;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.upload-zone p {
  color: #6c757d;
  margin-bottom: 20px;
}

.file-input {
  display: none;
}

.upload-options {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.export-options {
  display: flex;
  gap: 16px;
  align-items: end;
  flex-wrap: wrap;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-group label {
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}

.export-format,
.data-range {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.backup-status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.status-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  position: relative;
}

.status-card h4 {
  margin: 0 0 8px 0;
  color: #495057;
  font-size: 14px;
}

.status-text {
  margin: 0;
  color: #6c757d;
  font-size: 13px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  top: 16px;
  right: 16px;
}

.status-indicator.active {
  background: #28a745;
}

.status-indicator.success {
  background: #20c997;
}

.status-indicator.info {
  background: #17a2b8;
}

.cleanup-options {
  display: grid;
  gap: 20px;
}

.cleanup-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cleanup-item h4 {
  margin: 0 0 8px 0;
  color: #495057;
  font-size: 16px;
}

.cleanup-item p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

.permissions-table {
  margin-bottom: 20px;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
  border-radius: 6px;
  margin-bottom: 8px;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  margin-bottom: 8px;
  align-items: center;
}

.row-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
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

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover {
  background: #138496;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}
</style>
