<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>📋 数据管理模块</h1>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">4</span>
          <span class="stat-label">管理功能</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">2.3GB</span>
          <span class="stat-label">备份大小</span>
        </div>
      </div>
    </div>

    <div class="page-content">
      <!-- 内容已全部清空 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataManagement',
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

.management-tabs {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(102, 126, 234, 0.1);
  overflow: hidden;
  width: 100%;
  position: relative;
}

.management-tabs::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

  .tab-buttons {
    flex-direction: column;
  }

  .export-options {
    flex-direction: column;
    align-items: stretch;
  }

  .backup-status {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
