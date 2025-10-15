<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>🔧 模型相关模块</h1>
        <!-- <p class="header-description">管理异常检测模型，保障适配性与灵活性</p> -->
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ totalModels }}</span>
          <span class="stat-label">检测模型</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ activeModels }}</span>
          <span class="stat-label">运行中</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ avgAccuracy }}%</span>
          <span class="stat-label">平均准确率</span>
        </div>
      </div>
    </div>

    <div class="page-content">
      <!-- 功能导航标签 -->
      <div class="function-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-text">{{ tab.name }}</span>
        </button>
      </div>

      <!-- 模型基本信息查询 -->
      <div v-if="activeTab === 'basic-info'" class="tab-content">
        <div class="info-search-section">
          <div class="search-header">
            <h3>📋 模型基本信息查询</h3>
            <div class="search-controls">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="搜索模型名称、版本号或描述..."
                class="search-input"
                @input="onSearchInput"
              >
              <button @click="clearSearch" class="btn btn-secondary">清空</button>
            </div>
          </div>
          
          <div class="model-details-grid">
            <div 
              v-for="model in filteredModels" 
              :key="model.id"
              class="model-detail-card"
            >
              <div class="detail-header">
                <h4>{{ model.name }}</h4>
                <span :class="['status-badge', model.status]">{{ getStatusText(model.status) }}</span>
              </div>
              <div class="detail-content">
                <div class="detail-row">
                  <span class="label">版本号：</span>
                  <span class="value">{{ model.version }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">训练日期：</span>
                  <span class="value">{{ model.trainingDate }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">适用机型：</span>
                  <span class="value">{{ model.engineTypes.join(', ') }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">说明：</span>
                  <span class="value">{{ model.description }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">准确率：</span>
                  <span class="value accuracy">{{ model.accuracy }}%</span>
                </div>
              </div>
              <div class="detail-actions">
                <button @click="viewModelDetails(model)" class="btn btn-primary btn-sm">查看详情</button>
                <button @click="editModel(model)" class="btn btn-secondary btn-sm">编辑</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 参数配置 -->
      <div v-if="activeTab === 'parameter-config'" class="tab-content">
        <div class="config-section">
          <div class="config-header">
            <h3>⚙️ 参数配置</h3>
            <p class="config-description">提供可视化配置界面，支持设置异常触发阈值与数据分析时间窗口</p>
          </div>
          
          <div class="config-content">
            <div class="config-panel">
              <h4>异常阈值配置</h4>
              <div class="threshold-config">
                <div class="config-item">
                  <label>温度异常阈值 (°C)</label>
                  <div class="input-group">
                    <input v-model="config.thresholds.temperature" type="number" class="config-input">
                    <span class="unit">°C</span>
                  </div>
                </div>
                <div class="config-item">
                  <label>压力异常阈值 (kPa)</label>
                  <div class="input-group">
                    <input v-model="config.thresholds.pressure" type="number" class="config-input">
                    <span class="unit">kPa</span>
                  </div>
                </div>
                <div class="config-item">
                  <label>振动异常阈值 (mm/s)</label>
                  <div class="input-group">
                    <input v-model="config.thresholds.vibration" type="number" class="config-input">
                    <span class="unit">mm/s</span>
                  </div>
                </div>
                <div class="config-item">
                  <label>转速异常阈值 (RPM)</label>
                  <div class="input-group">
                    <input v-model="config.thresholds.rpm" type="number" class="config-input">
                    <span class="unit">RPM</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="config-panel">
              <h4>时间窗口配置</h4>
              <div class="time-window-config">
                <div class="config-item">
                  <label>数据分析窗口 (分钟)</label>
                  <div class="input-group">
                    <input v-model="config.timeWindow.analysisWindow" type="number" class="config-input">
                    <span class="unit">分钟</span>
                  </div>
                </div>
                <div class="config-item">
                  <label>异常检测间隔 (秒)</label>
                  <div class="input-group">
                    <input v-model="config.timeWindow.detectionInterval" type="number" class="config-input">
                    <span class="unit">秒</span>
                  </div>
                </div>
                <div class="config-item">
                  <label>历史数据保留期 (天)</label>
                  <div class="input-group">
                    <input v-model="config.timeWindow.dataRetention" type="number" class="config-input">
                    <span class="unit">天</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="config-actions">
              <button @click="saveConfig" class="btn btn-primary">保存配置</button>
              <button @click="resetConfig" class="btn btn-secondary">重置</button>
              <button @click="testConfig" class="btn btn-info">测试配置</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 模型列表 -->
      <div v-if="activeTab === 'model-list'" class="tab-content">
        <div class="model-list-section">
          <div class="list-header">
            <h3>📊 模型列表</h3>
            <p class="list-description">按发动机型号分组陈列模型，支持同一型号配置多个算法模型</p>
            <div class="list-controls">
              <select v-model="selectedEngineType" class="filter-select">
                <option value="">全部机型</option>
                <option v-for="type in engineTypes" :key="type" :value="type">{{ type }}</option>
              </select>
              <button @click="addNewModel" class="btn btn-primary">添加模型</button>
            </div>
          </div>

          <div class="model-groups">
            <div 
              v-for="group in groupedModels" 
              :key="group.engineType"
              class="model-group"
            >
              <div class="group-header">
                <h4>{{ group.engineType }}</h4>
                <span class="model-count">{{ group.models.length }} 个模型</span>
              </div>
              <div class="group-models">
                <div 
                  v-for="model in group.models" 
                  :key="model.id"
                  class="model-item"
                >
                  <div class="model-info">
                    <div class="model-name">{{ model.name }}</div>
                    <div class="model-version">v{{ model.version }}</div>
                    <div class="model-algorithm">{{ model.algorithm }}</div>
                  </div>
                  <div class="model-metrics">
                    <div class="metric">
                      <span class="metric-label">准确率</span>
                      <span class="metric-value">{{ model.accuracy }}%</span>
                    </div>
                    <div class="metric">
                      <span class="metric-label">适用场景</span>
                      <span class="metric-value">{{ model.scenario }}</span>
                    </div>
                  </div>
                  <div class="model-status">
                    <span :class="['status-indicator', model.status]"></span>
                    <span class="status-text">{{ getStatusText(model.status) }}</span>
                  </div>
                  <div class="model-actions">
                    <button @click="configureModel(model)" class="btn btn-sm btn-primary">配置</button>
                    <button @click="testModel(model)" class="btn btn-sm btn-info">测试</button>
                    <button @click="deleteModel(model)" class="btn btn-sm btn-danger">删除</button>
                  </div>
                </div>
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
  name: 'ModelRelated',
  data() {
    return {
      activeTab: 'basic-info',
      searchQuery: '',
      selectedEngineType: '',
      
      // 功能标签
      tabs: [
        { id: 'basic-info', name: '基本信息', icon: '📋' },
        { id: 'parameter-config', name: '参数配置', icon: '⚙️' },
        { id: 'model-list', name: '模型列表', icon: '📊' }
      ],
      
      // 配置数据
      config: {
        thresholds: {
          temperature: 80,
          pressure: 200,
          vibration: 5.0,
          rpm: 12000
        },
        timeWindow: {
          analysisWindow: 30,
          detectionInterval: 5,
          dataRetention: 90
        }
      },
      
      // 模型数据
      models: [
        {
          id: 1,
          name: 'CFM56-7B异常检测模型',
          version: '2.1.0',
          trainingDate: '2024-01-15',
          engineTypes: ['CFM56-7B', 'CFM56-7B24'],
          description: '基于深度学习的CFM56系列发动机异常检测模型，适用于温度、压力、振动等多维度监测',
          accuracy: 94.2,
          status: 'active',
          algorithm: 'LSTM + CNN',
          scenario: '实时监测'
        },
        {
          id: 2,
          name: 'GE90-115B故障预测模型',
          version: '1.8.5',
          trainingDate: '2024-01-10',
          engineTypes: ['GE90-115B'],
          description: '专门针对GE90系列发动机的故障预测模型，提前识别潜在故障风险',
          accuracy: 91.8,
          status: 'training',
          algorithm: 'Random Forest',
          scenario: '预测分析'
        },
        {
          id: 3,
          name: 'Trent 900振动分析模型',
          version: '3.0.2',
          trainingDate: '2024-01-20',
          engineTypes: ['Trent 900', 'Trent 1000'],
          description: '专注于振动信号分析的Trent系列发动机模型，提供高精度的振动异常检测',
          accuracy: 96.5,
          status: 'active',
          algorithm: 'SVM + Wavelet',
          scenario: '振动监测'
        },
        {
          id: 4,
          name: 'PW1100G综合检测模型',
          version: '1.5.3',
          trainingDate: '2024-01-08',
          engineTypes: ['PW1100G', 'PW1500G'],
          description: 'Pratt & Whitney系列发动机的综合异常检测模型，支持多传感器融合分析',
          accuracy: 89.7,
          status: 'inactive',
          algorithm: 'Ensemble Learning',
          scenario: '综合检测'
        }
      ],
      
      engineTypes: ['CFM56-7B', 'CFM56-7B24', 'GE90-115B', 'Trent 900', 'Trent 1000', 'PW1100G', 'PW1500G']
    }
  },
  
  mounted() {
    // 为全屏页面添加特殊类名
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.add('fullscreen');
    }
  },
  
  beforeUnmount() {
    // 清理时移除特殊类名
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.remove('fullscreen');
    }
  },
  
  computed: {
    totalModels() {
      return this.models.length
    },
    
    activeModels() {
      return this.models.filter(model => model.status === 'active').length
    },
    
    avgAccuracy() {
      const total = this.models.reduce((sum, model) => sum + model.accuracy, 0)
      return (total / this.models.length).toFixed(1)
    },
    
    filteredModels() {
      if (!this.searchQuery) return this.models
      
      const query = this.searchQuery.toLowerCase()
      return this.models.filter(model => 
        model.name.toLowerCase().includes(query) ||
        model.version.toLowerCase().includes(query) ||
        model.description.toLowerCase().includes(query) ||
        model.engineTypes.some(type => type.toLowerCase().includes(query))
      )
    },
    
    groupedModels() {
      let filtered = this.models
      if (this.selectedEngineType) {
        filtered = this.models.filter(model => 
          model.engineTypes.includes(this.selectedEngineType)
        )
      }
      
      const groups = {}
      filtered.forEach(model => {
        model.engineTypes.forEach(engineType => {
          if (!groups[engineType]) {
            groups[engineType] = {
              engineType,
              models: []
            }
          }
          groups[engineType].models.push(model)
        })
      })
      
      return Object.values(groups)
    }
  },
  
  methods: {
    onSearchInput() {
      // 搜索输入处理
    },
    
    clearSearch() {
      this.searchQuery = ''
    },
    
    getStatusText(status) {
      const statusMap = {
        'active': '运行中',
        'training': '训练中',
        'inactive': '未激活'
      }
      return statusMap[status] || '未知'
    },
    
    viewModelDetails(model) {
      console.log('查看模型详情:', model)
    },
    
    editModel(model) {
      console.log('编辑模型:', model)
    },
    
    saveConfig() {
      console.log('保存配置:', this.config)
      // 这里可以添加保存配置的逻辑
    },
    
    resetConfig() {
      this.config = {
        thresholds: {
          temperature: 80,
          pressure: 200,
          vibration: 5.0,
          rpm: 12000
        },
        timeWindow: {
          analysisWindow: 30,
          detectionInterval: 5,
          dataRetention: 90
        }
      }
    },
    
    testConfig() {
      console.log('测试配置:', this.config)
    },
    
    addNewModel() {
      console.log('添加新模型')
    },
    
    configureModel(model) {
      console.log('配置模型:', model)
    },
    
    testModel(model) {
      console.log('测试模型:', model)
    },
    
    deleteModel(model) {
      console.log('删除模型:', model)
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

/* 隐藏滚动条样式 */

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
  padding: 0;
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.page-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 功能标签样式 */
.function-tabs {
  display: flex;
  gap: 8px;
  margin: 40px 30px 32px 30px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.tab-button:hover {
  background: #f8f9fa;
  color: #333;
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.tab-icon {
  font-size: 16px;
}

.tab-text {
  font-weight: 600;
}

/* 标签内容样式 */
.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 基本信息查询样式 */
.info-search-section {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(102, 126, 234, 0.1);
  margin: 0 30px 40px 30px;
  position: relative;
  overflow: hidden;
}

.info-search-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.search-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  padding: 10px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  width: 300px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.model-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  width: 100%;
}

.model-detail-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.model-detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.detail-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.training {
  background: #fff3cd;
  color: #856404;
}

.status-badge.inactive {
  background: #e2e3e5;
  color: #383d41;
}

.detail-content {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-row .label {
  color: #666;
  font-weight: 500;
}

.detail-row .value {
  color: #2c3e50;
  font-weight: 600;
}

.detail-row .value.accuracy {
  color: #28a745;
}

.detail-actions {
  display: flex;
  gap: 8px;
}

/* 参数配置样式 */
.config-section {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(102, 126, 234, 0.1);
  margin: 0 30px 40px 30px;
  position: relative;
  overflow: hidden;
}

.config-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.config-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.config-header h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.config-description {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.config-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
}

.config-panel {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.config-panel h4 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.config-item {
  margin-bottom: 16px;
}

.config-item label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.config-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.unit {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  min-width: 40px;
}

.config-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;
}

/* 模型列表样式 */
.model-list-section {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(102, 126, 234, 0.1);
  margin: 0 30px 40px 30px;
  position: relative;
  overflow: hidden;
}

.model-list-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.list-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.list-header h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.list-description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
}

.list-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.model-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.model-group {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.group-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.model-count {
  font-size: 14px;
  opacity: 0.9;
}

.group-models {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  width: 100%;
}

.model-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.model-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.model-info {
  margin-bottom: 12px;
}

.model-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.model-version {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.model-algorithm {
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
}

.model-metrics {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 12px;
  color: #666;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.model-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.active {
  background: #28a745;
}

.status-indicator.training {
  background: #ffc107;
}

.status-indicator.inactive {
  background: #6c757d;
}

.status-text {
  font-size: 12px;
  color: #666;
}

.model-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
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
  max-width: 1200px;
  margin: 0 auto;
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
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6c4bb8 100%);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .page-container {
    width: calc(100vw - 240px);
  }
}

@media (max-width: 768px) {
  .page-container {
    width: calc(100vw - 240px);
  }

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
    flex: 1;
  }

  .function-tabs {
    margin: 30px 20px 32px 20px;
  }

  .info-search-section,
  .config-section,
  .model-list-section {
    margin: 0 20px 30px 20px;
    padding: 30px 20px;
  }

  .function-tabs {
    flex-direction: column;
    gap: 4px;
  }

  .tab-button {
    justify-content: center;
  }

  .search-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .search-controls {
    flex-direction: column;
    gap: 8px;
  }

  .search-input {
    width: 100%;
  }

  .model-details-grid {
    grid-template-columns: 1fr;
  }

  .config-content {
    grid-template-columns: 1fr;
  }

  .config-actions {
    flex-direction: column;
  }

  .list-controls {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .group-models {
    grid-template-columns: 1fr;
  }

  .model-metrics {
    flex-direction: column;
    gap: 8px;
  }

  .model-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-container {
    width: 100vw;
    right: 0;
    left: 0;
  }

  .page-content {
    flex: 1;
  }

  .function-tabs {
    margin: 20px 15px 24px 15px;
  }

  .info-search-section,
  .config-section,
  .model-list-section {
    margin: 0 15px 20px 15px;
    padding: 20px 15px;
  }
}
</style>
