<template>
  <div class="engine-filter">
    <div class="filter-header">
      <div class="header-content">
        <h1>🔍 发动机筛选模块</h1>
        <!-- <p class="header-description">根据各种条件筛选和过滤发动机数据，支持多维度查询和高级分析</p> -->
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ filteredData.length }}</span>
          <span class="stat-label">筛选结果</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ testData.length }}</span>
          <span class="stat-label">总发动机数</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ activeFiltersCount }}</span>
          <span class="stat-label">筛选条件</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ anomalyCount }}</span>
          <span class="stat-label">异常记录</span>
        </div>
      </div>
    </div>

    <div class="filter-content">
      <!-- 筛选条件面板 -->
      <div class="filter-panel">
        <div class="panel-header">
          <h3>🎯 筛选条件</h3>
          <div class="panel-actions">
            <button @click="applyFilters" class="btn btn-primary">
              <span class="btn-icon">🔍</span>
              应用筛选
            </button>
            <button @click="resetFilters" class="btn btn-secondary">
              <span class="btn-icon">🔄</span>
              重置条件
            </button>
          </div>
        </div>

        <div class="filter-sections">
          <!-- 按基础属性筛选 -->
          <div class="filter-section">
            <h4>📋 按基础属性筛选</h4>
            <div class="filter-grid">
              <div class="filter-item filter-item-relative">
                <label>流水号/机型号</label>
                <input 
                  v-model="filters.serialNumber" 
                  type="text" 
                  placeholder="输入流水号或机型号关键词" 
                  class="filter-input"
                  @input="onSerialNumberInput"
                >
                <div v-if="serialNumberSuggestions.length > 0" class="suggestions-dropdown">
                  <div 
                    v-for="suggestion in serialNumberSuggestions" 
                    :key="suggestion"
                    @click="selectSerialNumber(suggestion)"
                    class="suggestion-item"
                  >
                    {{ suggestion }}
                  </div>
                </div>
              </div>
              <div class="filter-item">
                <label>测试日期</label>
                <div class="date-range-container">
                  <input 
                    v-model="filters.testDateStart" 
                    type="date" 
                    class="date-input"
                    placeholder="开始日期"
                  >
                  <span class="date-separator">至</span>
                  <input 
                    v-model="filters.testDateEnd" 
                    type="date" 
                    class="date-input"
                    placeholder="结束日期"
                  >
                </div>
                <div class="quick-date-options">
                  <button @click="setQuickDate('today')" class="quick-date-btn">今天</button>
                  <button @click="setQuickDate('week')" class="quick-date-btn">近7天</button>
                  <button @click="setQuickDate('month')" class="quick-date-btn">近30天</button>
                  <button @click="setQuickDate('year')" class="quick-date-btn">近一年</button>
                </div>
              </div>
              <div class="filter-item">
                <label>台架编号</label>
                <select v-model="filters.testBenchNumber" class="filter-select">
                  <option value="">全部台架</option>
                  <option v-for="bench in testBenchNumbers" :key="bench" :value="bench">{{ bench }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 按异常状态筛选 -->
          <div class="filter-section">
            <h4>⚠️ 按异常状态筛选</h4>
            <div class="filter-grid">
              <div class="filter-item">
                <label>异常状态</label>
                <div class="anomaly-options">
                  <label class="radio-option">
                    <input type="radio" v-model="filters.anomalyStatus" value="all">
                    <span class="radio-label">全部</span>
                  </label>
                  <label class="radio-option">
                    <input type="radio" v-model="filters.anomalyStatus" value="normal">
                    <span class="radio-label normal">无异常</span>
                  </label>
                  <label class="radio-option">
                    <input type="radio" v-model="filters.anomalyStatus" value="overall">
                    <span class="radio-label overall">总体异常</span>
                  </label>
                  <label class="radio-option">
                    <input type="radio" v-model="filters.anomalyStatus" value="phased">
                    <span class="radio-label phased">分阶段异常</span>
                  </label>
                </div>
              </div>
              <div v-if="filters.anomalyStatus === 'phased'" class="filter-item">
                <label>异常阶段</label>
                <div class="phase-options">
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="filters.anomalyPhases" value="startup">
                    <span class="checkbox-label">启动阶段</span>
                  </label>
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="filters.anomalyPhases" value="steady">
                    <span class="checkbox-label">稳态阶段</span>
                  </label>
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="filters.anomalyPhases" value="shutdown">
                    <span class="checkbox-label">停机阶段</span>
                  </label>
                </div>
              </div>
              <div class="filter-item">
                <label>异常类型</label>
                <div class="anomaly-type-options">
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="filters.anomalyTypes" value="temperature">
                    <span class="checkbox-label">温度异常</span>
                  </label>
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="filters.anomalyTypes" value="pressure">
                    <span class="checkbox-label">压力异常</span>
                  </label>
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="filters.anomalyTypes" value="vibration">
                    <span class="checkbox-label">振动异常</span>
                  </label>
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="filters.anomalyTypes" value="rpm">
                    <span class="checkbox-label">转速异常</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 组合筛选 -->
          <div class="filter-section">
            <h4>🔗 组合筛选</h4>
            <div class="filter-grid">
              <div class="filter-item">
                <label>筛选模式</label>
                <div class="filter-mode-options">
                  <label class="radio-option">
                    <input type="radio" v-model="filters.filterMode" value="and">
                    <span class="radio-label">AND (同时满足)</span>
                  </label>
                  <label class="radio-option">
                    <input type="radio" v-model="filters.filterMode" value="or">
                    <span class="radio-label">OR (满足其一)</span>
                  </label>
                </div>
              </div>
              <div class="filter-item">
                <label>排序方式</label>
                <select v-model="filters.sortBy" class="filter-select">
                  <option value="testDate">按测试日期</option>
                  <option value="serialNumber">按流水号</option>
                  <option value="anomalyCount">按异常数量</option>
                  <option value="testBench">按台架编号</option>
                </select>
              </div>
              <div class="filter-item">
                <label>排序顺序</label>
                <div class="sort-order-options">
                  <label class="radio-option">
                    <input type="radio" v-model="filters.sortOrder" value="desc">
                    <span class="radio-label">降序</span>
                  </label>
                  <label class="radio-option">
                    <input type="radio" v-model="filters.sortOrder" value="asc">
                    <span class="radio-label">升序</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选结果展示 -->
      <div class="results-panel">
        <div class="results-header">
          <h3>📋 筛选结果</h3>
        <div class="results-summary">
          <span class="result-count">共找到 {{ filteredData.length }} 条记录</span>
          <span v-if="filteredData.length > 0" class="result-stats">
            | 异常记录: {{ anomalyCount }} | 筛选条件: {{ activeFiltersCount }}
          </span>
        </div>
        </div>

        <div class="results-content">
          <div v-if="filteredData.length === 0" class="empty-content">
            <h2>暂无匹配数据</h2>
            <p>请调整筛选条件后重新搜索</p>
          </div>
          
          <div v-else class="results-table">
            <table class="data-table">
              <thead>
                <tr>
                  <th>流水号</th>
                  <th>发动机型号</th>
                  <th>测试日期</th>
                  <th>台架编号</th>
                  <th>异常状态</th>
                  <th>异常数量</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredData" :key="item.id">
                  <td>{{ item.serialNumber }}</td>
                  <td>{{ item.engineModel }}</td>
                  <td>{{ item.testDate }}</td>
                  <td>{{ item.testBenchNumber }}</td>
                  <td>
                    <span :class="['status-badge', item.anomalyStatus]">
                      {{ getAnomalyStatusText(item.anomalyStatus) }}
                    </span>
                  </td>
                  <td>
                    <span class="anomaly-count">{{ item.anomalyCount }}</span>
                  </td>
                  <td>
                    <button @click="viewDetails(item)" class="btn btn-primary btn-sm">
                      查看详情
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EngineFilter',
  data() {
    return {
      filters: {
        // 基础属性筛选
        serialNumber: '',
        testDateStart: '',
        testDateEnd: '',
        testBenchNumber: '',
        
        // 异常状态筛选
        anomalyStatus: 'all',
        anomalyPhases: [],
        anomalyTypes: [],
        
        // 组合筛选
        filterMode: 'and',
        sortBy: 'testDate',
        sortOrder: 'desc'
      },
      // 建议数据
      serialNumberSuggestions: [],
      testBenchNumbers: [
        'TB-A001', 'TB-A002', 'TB-A003', 'TB-B001', 'TB-B002',
        'TB-C001', 'TB-C002', 'TB-D001', 'TB-D002'
      ],
      // 模拟测试数据
      testData: [
        {
          id: 1,
          serialNumber: 'SP2024001',
          engineModel: 'CFM56-7B24',
          testDate: '2024-01-15',
          testBenchNumber: 'TB-A001',
          anomalyStatus: 'normal',
          anomalyPhases: [],
          anomalyTypes: [],
          anomalyCount: 0
        },
        {
          id: 2,
          serialNumber: 'SP2024002',
          engineModel: 'GE90-115B',
          testDate: '2024-01-18',
          testBenchNumber: 'TB-A002',
          anomalyStatus: 'overall',
          anomalyPhases: ['startup', 'steady'],
          anomalyTypes: ['temperature', 'pressure'],
          anomalyCount: 3
        },
        {
          id: 3,
          serialNumber: 'SP2024003',
          engineModel: 'Trent 900',
          testDate: '2024-01-20',
          testBenchNumber: 'TB-B001',
          anomalyStatus: 'phased',
          anomalyPhases: ['steady'],
          anomalyTypes: ['vibration'],
          anomalyCount: 1
        },
        {
          id: 4,
          serialNumber: 'SP2024004',
          engineModel: 'CFM56-5B',
          testDate: '2024-01-22',
          testBenchNumber: 'TB-A003',
          anomalyStatus: 'normal',
          anomalyPhases: [],
          anomalyTypes: [],
          anomalyCount: 0
        },
        {
          id: 5,
          serialNumber: 'SP2024005',
          engineModel: 'PW1100G',
          testDate: '2024-01-25',
          testBenchNumber: 'TB-B002',
          anomalyStatus: 'phased',
          anomalyPhases: ['shutdown'],
          anomalyTypes: ['rpm'],
          anomalyCount: 1
        }
      ]
    }
  },
  mounted() {
    // 为全屏页面添加特殊类名
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.add('fullscreen');
    }
    
    // 添加实时筛选监听
    this.setupRealtimeFiltering()
  },
  beforeUnmount() {
    // 清理时移除特殊类名
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.remove('fullscreen');
    }
  },
  computed: {
    filteredData() {
      let result = [...this.testData]
      
      // 基础属性筛选
      if (this.filters.serialNumber) {
        result = result.filter(item => 
          item.serialNumber.toLowerCase().includes(this.filters.serialNumber.toLowerCase()) ||
          item.engineModel.toLowerCase().includes(this.filters.serialNumber.toLowerCase())
        )
      }
      
      if (this.filters.testDateStart) {
        result = result.filter(item => item.testDate >= this.filters.testDateStart)
      }
      
      if (this.filters.testDateEnd) {
        result = result.filter(item => item.testDate <= this.filters.testDateEnd)
      }
      
      if (this.filters.testBenchNumber) {
        result = result.filter(item => item.testBenchNumber === this.filters.testBenchNumber)
      }
      
      // 异常状态筛选
      if (this.filters.anomalyStatus !== 'all') {
        if (this.filters.anomalyStatus === 'normal') {
          result = result.filter(item => item.anomalyStatus === 'normal')
        } else if (this.filters.anomalyStatus === 'overall') {
          result = result.filter(item => item.anomalyStatus === 'overall')
        } else if (this.filters.anomalyStatus === 'phased') {
          result = result.filter(item => item.anomalyStatus === 'phased')
          
          // 分阶段筛选
          if (this.filters.anomalyPhases.length > 0) {
            result = result.filter(item => 
              this.filters.anomalyPhases.some(phase => item.anomalyPhases.includes(phase))
            )
          }
        }
      }
      
      // 异常类型筛选
      if (this.filters.anomalyTypes.length > 0) {
        if (this.filters.filterMode === 'and') {
          result = result.filter(item => 
            this.filters.anomalyTypes.every(type => item.anomalyTypes.includes(type))
          )
        } else {
          result = result.filter(item => 
            this.filters.anomalyTypes.some(type => item.anomalyTypes.includes(type))
          )
        }
      }
      
      // 排序
      result.sort((a, b) => {
        let aValue, bValue
        
        switch (this.filters.sortBy) {
          case 'testDate':
            aValue = new Date(a.testDate)
            bValue = new Date(b.testDate)
            break
          case 'serialNumber':
            aValue = a.serialNumber
            bValue = b.serialNumber
            break
          case 'anomalyCount':
            aValue = a.anomalyCount
            bValue = b.anomalyCount
            break
          case 'testBench':
            aValue = a.testBenchNumber
            bValue = b.testBenchNumber
            break
          default:
            return 0
        }
        
        if (this.filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
      
      return result
    },
    
    activeFiltersCount() {
      let count = 0
      
      // 基础属性筛选
      if (this.filters.serialNumber) count++
      if (this.filters.testDateStart) count++
      if (this.filters.testDateEnd) count++
      if (this.filters.testBenchNumber) count++
      
      // 异常状态筛选
      if (this.filters.anomalyStatus !== 'all') count++
      if (this.filters.anomalyPhases.length > 0) count++
      
      // 异常类型筛选
      if (this.filters.anomalyTypes.length > 0) count++
      
      return count
    },
    
    anomalyCount() {
      return this.filteredData.filter(item => 
        item.anomalyStatus === 'overall' || item.anomalyStatus === 'phased'
      ).length
    }
  },
  methods: {
    applyFilters() {
      console.log('应用筛选条件:', this.filters)
      console.log('筛选结果:', this.filteredData)
      // 触发数字更新动画
      this.triggerNumberAnimation()
    },
    
    triggerNumberAnimation() {
      // 移除动画类，然后重新添加以触发动画
      const statNumbers = document.querySelectorAll('.stat-number')
      statNumbers.forEach(el => {
        el.style.animation = 'none'
        el.offsetHeight // 触发重排
        el.style.animation = 'numberUpdate 0.5s ease-out'
      })
    },
    
    setupRealtimeFiltering() {
      // 监听筛选条件变化，实时更新统计数字
      this.$watch('filters', () => {
        this.$nextTick(() => {
          this.triggerNumberAnimation()
        })
      }, { deep: true })
    },
    
    resetFilters() {
      this.filters = {
        serialNumber: '',
        testDateStart: '',
        testDateEnd: '',
        testBenchNumber: '',
        anomalyStatus: 'all',
        anomalyPhases: [],
        anomalyTypes: [],
        filterMode: 'and',
        sortBy: 'testDate',
        sortOrder: 'desc'
      }
      this.serialNumberSuggestions = []
    },
    
    // 流水号输入建议
    onSerialNumberInput() {
      if (this.filters.serialNumber.length > 0) {
        this.serialNumberSuggestions = this.testData
          .filter(item => 
            item.serialNumber.toLowerCase().includes(this.filters.serialNumber.toLowerCase()) ||
            item.engineModel.toLowerCase().includes(this.filters.serialNumber.toLowerCase())
          )
          .map(item => item.serialNumber)
          .slice(0, 5)
      } else {
        this.serialNumberSuggestions = []
      }
    },
    
    selectSerialNumber(suggestion) {
      this.filters.serialNumber = suggestion
      this.serialNumberSuggestions = []
    },
    
    // 快捷日期选择
    setQuickDate(type) {
      const today = new Date()
      const startDate = new Date()
      
      switch (type) {
        case 'today':
          this.filters.testDateStart = this.formatDate(today)
          this.filters.testDateEnd = this.formatDate(today)
          break
        case 'week':
          startDate.setDate(today.getDate() - 7)
          this.filters.testDateStart = this.formatDate(startDate)
          this.filters.testDateEnd = this.formatDate(today)
          break
        case 'month':
          startDate.setDate(today.getDate() - 30)
          this.filters.testDateStart = this.formatDate(startDate)
          this.filters.testDateEnd = this.formatDate(today)
          break
        case 'year':
          startDate.setFullYear(today.getFullYear() - 1)
          this.filters.testDateStart = this.formatDate(startDate)
          this.filters.testDateEnd = this.formatDate(today)
          break
      }
    },
    
    formatDate(date) {
      return date.toISOString().split('T')[0]
    },
    
    // 获取异常状态文本
    getAnomalyStatusText(status) {
      const statusMap = {
        'normal': '无异常',
        'overall': '总体异常',
        'phased': '分阶段异常'
      }
      return statusMap[status] || '未知'
    },
    
    // 查看详情
    viewDetails(item) {
      console.log('查看详情:', item)
      // 这里可以跳转到详情页面或打开详情弹窗
    }
  }
}
</script>

<style scoped>
.engine-filter {
  width: calc(100vw - 280px);
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 自定义滚动条样式 */
.engine-filter::-webkit-scrollbar {
  width: 8px;
}

.engine-filter::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.engine-filter::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.engine-filter::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6c4bb8 100%);
}

.filter-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.filter-header::before {
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

.filter-header h1 {
  margin: 0 0 8px 0;
  color: white;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header-description {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
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
  transition: all 0.3s ease;
  animation: numberUpdate 0.5s ease-out;
}

@keyframes numberUpdate {
  0% {
    transform: scale(1);
    color: white;
  }
  50% {
    transform: scale(1.2);
    color: #ffd700;
  }
  100% {
    transform: scale(1);
    color: white;
  }
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.filter-content {
  flex: 1;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
  padding: 20px 20px 40px 20px;
  min-height: calc(100vh - 120px);
  align-content: start;
}

.filter-panel {
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

/* 筛选面板滚动条样式 */
.filter-panel::-webkit-scrollbar {
  width: 6px;
}

.filter-panel::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.filter-panel::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.filter-panel::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.panel-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.panel-actions {
  display: flex;
  gap: 10px;
}

.filter-sections {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  min-height: 0;
}

.filter-section {
  margin-bottom: 32px;
}

.filter-section h4 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
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
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.range-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.range-separator {
  color: #666;
  font-weight: 500;
}

.results-panel {
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 160px);
  overflow: hidden;
}

.results-header {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.results-summary {
  display: flex;
  align-items: center;
  gap: 15px;
}

.result-count {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 600;
  color: #2c3e50;
}

.result-stats {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}

.results-actions {
  display: flex;
  gap: 10px;
}

.results-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  min-height: 0;
  max-height: calc(100vh - 240px);
}

/* 结果面板滚动条样式 */
.results-content::-webkit-scrollbar {
  width: 6px;
}

.results-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.results-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.results-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}


.empty-content {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-content h2 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.empty-content p {
  margin: 0;
  font-size: 16px;
}

/* 新的筛选组件样式 */
.filter-item-relative {
  position: relative;
}

.filter-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.date-range-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.date-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.date-separator {
  color: #666;
  font-weight: 500;
}

.quick-date-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-date-btn {
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-date-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.anomaly-options,
.phase-options,
.anomaly-type-options,
.filter-mode-options,
.sort-order-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.radio-option:hover,
.checkbox-option:hover {
  background-color: #f8f9fa;
}

.radio-option input[type="radio"],
.checkbox-option input[type="checkbox"] {
  margin: 0;
  width: 16px;
  height: 16px;
}

.radio-label,
.checkbox-label {
  font-size: 14px;
  font-weight: 500;
}

.radio-label.normal {
  color: #28a745;
}

.radio-label.overall {
  color: #dc3545;
}

.radio-label.phased {
  color: #ffc107;
}

/* 结果表格样式 */
.results-table {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.data-table th {
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.normal {
  background: #d4edda;
  color: #155724;
}

.status-badge.overall {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.phased {
  background: #fff3cd;
  color: #856404;
}

.anomaly-count {
  font-weight: 600;
  color: #dc3545;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-icon {
  font-size: 16px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .filter-content {
    grid-template-columns: 350px 1fr;
  }
}

@media (max-width: 768px) {
  .engine-filter {
    width: calc(100vw - 240px);
  }
  
  .filter-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    padding: 15px 15px 40px 15px;
    gap: 15px;
    min-height: calc(100vh - 100px);
  }
  
  .filter-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 20px;
  }
  
  .header-stats {
    gap: 20px;
  }
  
  .filter-header h1 {
    font-size: 24px;
  }
  
  .filter-panel,
  .results-panel {
    max-height: none;
    overflow-y: visible;
  }
  
  .results-content {
    max-height: none;
  }
  
  .panel-actions {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .engine-filter {
    width: 100vw;
    right: 0;
    left: 0;
  }
}
</style>

