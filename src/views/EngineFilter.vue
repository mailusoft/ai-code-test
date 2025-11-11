<template>
  <div class="engine-filter">
    <!-- 返回首页按钮 -->
    <div class="back-home-btn" @click="goHome" title="返回首页">
      <span class="back-icon">←</span>
      <span class="back-text">返回首页</span>
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
          <!-- 横向导航栏式筛选菜单 -->
          <div class="filter-navbar">
            <!-- 数据类型 -->
            <div class="nav-item" @mouseenter="showDropdown('dataType')" @mouseleave="hideDropdown('dataType')">
              <span class="nav-label">
                数据类型
                <span class="nav-arrow">▼</span>
              </span>
              <div v-if="hoveredFilter === 'dataType'" class="nav-dropdown" @mouseenter="showDropdown('dataType')" @mouseleave="hideDropdown('dataType')">
                <div 
                  v-for="dt in dataTypes" 
                  :key="dt.name"
                  @click="selectDataType(dt.name)"
                  :class="['nav-dropdown-item', { active: filters.dataType === dt.name }]"
                >
                  {{ dt.name }}
                </div>
              </div>
            </div>

            <!-- 引擎列 -->
            <div class="nav-item" @mouseenter="showDropdown('engines')" @mouseleave="hideDropdown('engines')">
              <span class="nav-label">
                引擎列
                <span class="nav-arrow">▼</span>
              </span>
              <div v-if="hoveredFilter === 'engines'" class="nav-dropdown nav-dropdown-large" @mouseenter="showDropdown('engines')" @mouseleave="hideDropdown('engines')">
                <div class="nav-dropdown-header">选择引擎（可多选）</div>
                <div class="nav-dropdown-scroll">
                  <div 
                    v-for="engine in availableEngines" 
                    :key="engine"
                    @click="toggleEngine(engine)"
                    :class="['nav-dropdown-item', { active: filters.engines.includes(engine) }]"
                  >
                    <span class="checkbox-icon">{{ filters.engines.includes(engine) ? '✓' : '' }}</span>
                    {{ engine }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 流水号/机型号 -->
            <div class="nav-item nav-item-input" @mouseenter="showDropdown('serialNumber')" @mouseleave="hideDropdown('serialNumber')">
              <span class="nav-label">
                流水号/机型号
                <span class="nav-arrow">▼</span>
              </span>
              <div v-if="hoveredFilter === 'serialNumber'" class="nav-dropdown nav-dropdown-input" @mouseenter="showDropdown('serialNumber')" @mouseleave="hideDropdown('serialNumber')">
                <input 
                  v-model="filters.serialNumber" 
                  type="text" 
                  placeholder="输入流水号或机型号关键词" 
                  class="nav-input"
                  @input="onSerialNumberInput"
                  @click.stop
                >
                <div v-if="serialNumberSuggestions.length > 0" class="nav-suggestions">
                  <div 
                    v-for="suggestion in serialNumberSuggestions" 
                    :key="suggestion"
                    @click="selectSerialNumber(suggestion)"
                    class="nav-suggestion-item"
                  >
                    {{ suggestion }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 测试日期 -->
            <div class="nav-item" @mouseenter="showDropdown('testDate')" @mouseleave="hideDropdown('testDate')">
              <span class="nav-label">
                测试日期
                <span class="nav-arrow">▼</span>
              </span>
              <div v-if="hoveredFilter === 'testDate'" class="nav-dropdown nav-dropdown-date" @mouseenter="showDropdown('testDate')" @mouseleave="hideDropdown('testDate')">
                <div class="date-range-container">
                  <input 
                    v-model="filters.testDateStart" 
                    type="date" 
                    class="date-input"
                    placeholder="开始日期"
                    @click.stop
                  >
                  <span class="date-separator">至</span>
                  <input 
                    v-model="filters.testDateEnd" 
                    type="date" 
                    class="date-input"
                    placeholder="结束日期"
                    @click.stop
                  >
                </div>
                <div class="quick-date-options">
                  <button @click.stop="setQuickDate('today')" class="quick-date-btn">今天</button>
                  <button @click.stop="setQuickDate('week')" class="quick-date-btn">近7天</button>
                  <button @click.stop="setQuickDate('month')" class="quick-date-btn">近30天</button>
                  <button @click.stop="setQuickDate('year')" class="quick-date-btn">近一年</button>
                </div>
              </div>
            </div>

            <!-- 台架编号 -->
            <div class="nav-item" @mouseenter="showDropdown('testBench')" @mouseleave="hideDropdown('testBench')">
              <span class="nav-label">
                台架编号
                <span class="nav-arrow">▼</span>
              </span>
              <div v-if="hoveredFilter === 'testBench'" class="nav-dropdown" @mouseenter="showDropdown('testBench')" @mouseleave="hideDropdown('testBench')">
                <div 
                  @click="selectTestBench('')"
                  :class="['nav-dropdown-item', { active: filters.testBenchNumber === '' }]"
                >
                  全部台架
                </div>
                <div 
                  v-for="bench in testBenchNumbers" 
                  :key="bench"
                  @click="selectTestBench(bench)"
                  :class="['nav-dropdown-item', { active: filters.testBenchNumber === bench }]"
                >
                  {{ bench }}
                </div>
              </div>
            </div>

            <!-- 异常状态 -->
            <div class="nav-item" @mouseenter="showDropdown('anomalyStatus')" @mouseleave="hideDropdown('anomalyStatus')">
              <span class="nav-label">
                异常状态
                <span class="nav-arrow">▼</span>
              </span>
              <div v-if="hoveredFilter === 'anomalyStatus'" class="nav-dropdown" @mouseenter="showDropdown('anomalyStatus')" @mouseleave="hideDropdown('anomalyStatus')">
                <div 
                  @click="selectAnomalyStatus('all')"
                  :class="['nav-dropdown-item', { active: filters.anomalyStatus === 'all' }]"
                >
                  全部
                </div>
                <div 
                  @click="selectAnomalyStatus('normal')"
                  :class="['nav-dropdown-item', { active: filters.anomalyStatus === 'normal' }]"
                >
                  <span class="status-indicator normal"></span>
                  无异常
                </div>
                <div 
                  @click="selectAnomalyStatus('overall')"
                  :class="['nav-dropdown-item', { active: filters.anomalyStatus === 'overall' }]"
                >
                  <span class="status-indicator overall"></span>
                  总体异常
                </div>
                <div 
                  @click="selectAnomalyStatus('phased')"
                  :class="['nav-dropdown-item', { active: filters.anomalyStatus === 'phased' }]"
                >
                  <span class="status-indicator phased"></span>
                  分阶段异常
                </div>
              </div>
            </div>

            <!-- 异常类型 -->
            <div class="nav-item" @mouseenter="showDropdown('anomalyTypes')" @mouseleave="hideDropdown('anomalyTypes')">
              <span class="nav-label">
                异常类型
                <span class="nav-arrow">▼</span>
              </span>
              <div v-if="hoveredFilter === 'anomalyTypes'" class="nav-dropdown" @mouseenter="showDropdown('anomalyTypes')" @mouseleave="hideDropdown('anomalyTypes')">
                <div 
                  v-for="type in anomalyTypeOptions" 
                  :key="type.value"
                  @click="toggleAnomalyType(type.value)"
                  :class="['nav-dropdown-item', { active: filters.anomalyTypes.includes(type.value) }]"
                >
                  <span class="checkbox-icon">{{ filters.anomalyTypes.includes(type.value) ? '✓' : '' }}</span>
                  {{ type.label }}
                </div>
              </div>
            </div>

            <!-- 排序方式 -->
            <div class="nav-item" @mouseenter="showDropdown('sortBy')" @mouseleave="hideDropdown('sortBy')">
              <span class="nav-label">
                排序方式
                <span class="nav-arrow">▼</span>
              </span>
              <div v-if="hoveredFilter === 'sortBy'" class="nav-dropdown" @mouseenter="showDropdown('sortBy')" @mouseleave="hideDropdown('sortBy')">
                <div 
                  @click="selectSortBy('testDate')"
                  :class="['nav-dropdown-item', { active: filters.sortBy === 'testDate' }]"
                >
                  按测试日期
                </div>
                <div 
                  @click="selectSortBy('serialNumber')"
                  :class="['nav-dropdown-item', { active: filters.sortBy === 'serialNumber' }]"
                >
                  按流水号
                </div>
                <div 
                  @click="selectSortBy('anomalyCount')"
                  :class="['nav-dropdown-item', { active: filters.sortBy === 'anomalyCount' }]"
                >
                  按异常数量
                </div>
                <div 
                  @click="selectSortBy('testBench')"
                  :class="['nav-dropdown-item', { active: filters.sortBy === 'testBench' }]"
                >
                  按台架编号
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
          
          <div v-else class="results-dropdown-container">
            <div class="dropdown-select-wrapper">
              <select v-model="selectedResultIndex" class="results-dropdown" @change="onResultSelect">
                <option value="">请选择要查看的记录</option>
                <option 
                  v-for="(item, index) in filteredData" 
                  :key="item.id" 
                  :value="index"
                >
                  {{ item.serialNumber }} - {{ item.engineModel }} ({{ item.testDate }}) - {{ getAnomalyStatusText(item.anomalyStatus) }}
                </option>
              </select>
            </div>
            
            <div v-if="selectedResult" class="selected-result-details">
              <div class="detail-card">
                <div class="detail-header">
                  <h4>📋 记录详情</h4>
                </div>
                <div class="detail-body">
                  <div class="detail-row">
                    <span class="detail-label">流水号：</span>
                    <span class="detail-value">{{ selectedResult.serialNumber }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">发动机型号：</span>
                    <span class="detail-value">{{ selectedResult.engineModel }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">测试日期：</span>
                    <span class="detail-value">{{ selectedResult.testDate }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">台架编号：</span>
                    <span class="detail-value">{{ selectedResult.testBenchNumber }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">异常状态：</span>
                    <span :class="['status-badge', selectedResult.anomalyStatus]">
                      {{ getAnomalyStatusText(selectedResult.anomalyStatus) }}
                    </span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">异常数量：</span>
                    <span class="anomaly-count">{{ selectedResult.anomalyCount }}</span>
                  </div>
                  <div class="detail-actions">
                    <button @click="viewDetails(selectedResult)" class="btn btn-primary">
                      <span class="btn-icon">👁️</span>
                      查看详情
                    </button>
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
import { getDataTypes, filterData, getEngines } from '../services/api'

export default {
  name: 'EngineFilter',
  data() {
    return {
      filters: {
        // 基础属性筛选
        dataType: 'EOP-Sw',
        serialNumber: '',
        testDateStart: '',
        testDateEnd: '',
        testBenchNumber: '',
        engines: [],
        
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
      // 下拉菜单选中的结果索引
      selectedResultIndex: '',
      // 当前悬停的筛选项
      hoveredFilter: '',
      // 隐藏定时器
      hideTimer: null,
      // 异常类型选项
      anomalyTypeOptions: [
        { value: 'temperature', label: '温度异常' },
        { value: 'pressure', label: '压力异常' },
        { value: 'vibration', label: '振动异常' },
        { value: 'rpm', label: '转速异常' }
      ],
      // 数据源
      dataTypes: [],
      availableEngines: [],
      loading: false,
      error: null,
      // 模拟测试数据（作为备用）
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
    
    // 加载数据类型和引擎列表
    this.loadInitialData()
    
    // 添加实时筛选监听
    this.setupRealtimeFiltering()
  },
  beforeUnmount() {
    // 清理时移除特殊类名
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.remove('fullscreen');
    }
    // 清理定时器
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
    }
  },
  watch: {
    filteredData() {
      // 当筛选结果改变时，重置选中的结果
      this.selectedResultIndex = ''
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
    },
    
    selectedResult() {
      if (this.selectedResultIndex === '' || this.selectedResultIndex === null) {
        return null
      }
      const index = parseInt(this.selectedResultIndex)
      return this.filteredData[index] || null
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    async loadInitialData() {
      try {
        // 获取数据类型列表
        const datatypes = await getDataTypes()
        this.dataTypes = datatypes
        if (datatypes.length > 0) {
          this.filters.dataType = datatypes[0].name
        }
        
        // 获取引擎列表
        await this.loadEngines()
      } catch (error) {
        console.error('加载初始数据失败:', error)
      }
    },
    
    async loadEngines() {
      try {
        const result = await getEngines(this.filters.dataType)
        this.availableEngines = result.engines || []
      } catch (error) {
        console.error('加载引擎列表失败:', error)
        this.availableEngines = []
      }
    },
    
    async applyFilters() {
      this.loading = true
      this.error = null
      
      try {
        console.log('应用筛选条件:', this.filters)
        
        // 构建筛选参数
        const filterParams = {
          data_type: this.filters.dataType,
          file_index: 0,
          limit: 100,
          offset: 0
        }
        
        // 如果有引擎选择，添加引擎筛选
        if (this.filters.engines && this.filters.engines.length > 0) {
          filterParams.engines = this.filters.engines
        }
        
        // 如果有时间范围，添加时间范围筛选
        if (this.filters.testDateStart || this.filters.testDateEnd) {
          // 注意：后端的时间范围是数值类型，需要根据实际数据转换
          // 这里暂时不添加时间范围，因为后端接口需要float类型的时间值
        }
        
        // 调用后端筛选接口
        const result = await filterData(filterParams)
        
        // 将结果转换为前端需要的格式
        this.testData = result.data.map((item, index) => ({
          id: index + 1,
          serialNumber: item.serialNumber || `ENG-${index + 1}`,
          engineModel: this.filters.dataType,
          testDate: item.testDate || new Date().toISOString().split('T')[0],
          testBenchNumber: item.testBenchNumber || 'TB-A001',
          anomalyStatus: this.filters.anomalyStatus,
          anomalyPhases: [],
          anomalyTypes: [],
          anomalyCount: 0,
          rawData: item
        }))
        
        console.log('筛选结果:', this.filteredData)
        // 触发数字更新动画
        this.triggerNumberAnimation()
      } catch (error) {
        console.error('筛选数据失败:', error)
        this.error = error.message || '筛选数据失败'
      } finally {
        this.loading = false
      }
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
      this.selectedResultIndex = ''
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
      this.hoveredFilter = ''
    },
    
    // 导航栏筛选方法
    selectDataType(value) {
      this.filters.dataType = value
      this.loadEngines()
      this.hoveredFilter = ''
    },
    
    toggleEngine(engine) {
      const index = this.filters.engines.indexOf(engine)
      if (index > -1) {
        this.filters.engines.splice(index, 1)
      } else {
        this.filters.engines.push(engine)
      }
    },
    
    selectTestBench(bench) {
      this.filters.testBenchNumber = bench
      this.hoveredFilter = ''
    },
    
    selectAnomalyStatus(status) {
      this.filters.anomalyStatus = status
      this.hoveredFilter = ''
    },
    
    toggleAnomalyType(type) {
      const index = this.filters.anomalyTypes.indexOf(type)
      if (index > -1) {
        this.filters.anomalyTypes.splice(index, 1)
      } else {
        this.filters.anomalyTypes.push(type)
      }
    },
    
    selectSortBy(sortBy) {
      this.filters.sortBy = sortBy
      this.hoveredFilter = ''
    },
    
    // 显示下拉菜单（带延迟取消）
    showDropdown(filterName) {
      // 清除之前的隐藏定时器
      if (this.hideTimer) {
        clearTimeout(this.hideTimer)
        this.hideTimer = null
      }
      this.hoveredFilter = filterName
    },
    
    // 隐藏下拉菜单（延迟隐藏）
    hideDropdown(filterName) {
      // 设置延迟隐藏，500毫秒后隐藏
      this.hideTimer = setTimeout(() => {
        if (this.hoveredFilter === filterName) {
          this.hoveredFilter = ''
        }
        this.hideTimer = null
      }, 1000) // 500毫秒延迟
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
    },
    
    // 下拉菜单选择结果
    onResultSelect() {
      // 当选择改变时，可以触发其他操作
      if (this.selectedResult) {
        console.log('选中记录:', this.selectedResult)
      }
    }
  }
}
</script>

<style scoped>
.engine-filter {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.back-home-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
}

.back-home-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.back-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.back-home-btn:hover .back-icon {
  transform: translateX(-4px);
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
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  min-height: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.filter-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  max-height: 40vh;
  overflow: visible;
  position: relative;
  z-index: 10;
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
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  color: rgba(255, 255, 255, 0.9);
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
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
  padding: 16px 20px;
  overflow: visible;
  min-height: 0;
  position: relative;
}

/* 横向导航栏式筛选菜单 */
.filter-navbar {
  display: flex;
  align-items: center;
  gap: 0;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0;
  border: 1px solid #e9ecef;
  flex-wrap: wrap;
  position: relative;
  overflow: visible;
}

.nav-item {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.nav-label {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 20px;
  color: #495057;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-item:hover .nav-label {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.nav-item:hover .nav-arrow {
  transform: rotate(180deg);
}

.nav-arrow {
  font-size: 10px;
  transition: transform 0.3s ease;
  color: #999;
}

.nav-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  min-width: 180px;
  margin-top: 4px;
  animation: fadeInDown 0.3s ease;
}

.nav-dropdown-large {
  min-width: 300px;
  max-width: 400px;
}

.nav-dropdown-input {
  min-width: 280px;
  padding: 12px;
}

.nav-dropdown-date {
  min-width: 320px;
  padding: 16px;
}

.nav-dropdown-header {
  padding: 12px 16px;
  font-size: 12px;
  color: #6c757d;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.nav-dropdown-scroll {
  max-height: 300px;
  overflow-y: auto;
}

.nav-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f8f9fa;
}

.nav-dropdown-item:last-child {
  border-bottom: none;
}

.nav-dropdown-item:hover {
  background: #f8f9fa;
  color: #667eea;
}

.nav-dropdown-item.active {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  font-weight: 600;
}

.checkbox-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  color: #667eea;
  background: white;
}

.nav-dropdown-item.active .checkbox-icon {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-indicator.normal {
  background: #28a745;
}

.status-indicator.overall {
  background: #dc3545;
}

.status-indicator.phased {
  background: #ffc107;
}

.nav-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.nav-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.nav-suggestions {
  margin-top: 8px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: white;
}

.nav-suggestion-item {
  padding: 10px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f8f9fa;
}

.nav-suggestion-item:last-child {
  border-bottom: none;
}

.nav-suggestion-item:hover {
  background: #f8f9fa;
  color: #667eea;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  align-items: start;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item-full {
  grid-column: 1 / -1;
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 300px;
  position: relative;
  z-index: 1;
  overflow: hidden;
}


.results-header {
  background: linear-gradient(135deg, rgba(23, 162, 184, 0.3) 0%, rgba(19, 132, 150, 0.3) 100%);
  color: rgba(255, 255, 255, 0.9);
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
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
  padding: 16px 20px;
  padding-bottom: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

/* 筛选结果内容滚动条样式 */
.results-content::-webkit-scrollbar {
  width: 8px;
}

.results-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.results-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.results-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6c4bb8 100%);
}

/* 下拉菜单筛选模式样式 */
.results-dropdown-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.dropdown-select-wrapper {
  width: 100%;
}

.results-dropdown {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23667eea' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

.results-dropdown:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.results-dropdown:hover {
  border-color: #667eea;
}

.selected-result-details {
  width: 100%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: visible;
  border: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.detail-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
}

.detail-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.detail-body {
  padding: 24px;
}

.detail-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-of-type {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #555;
  min-width: 120px;
  font-size: 14px;
}

.detail-value {
  color: #2c3e50;
  font-size: 14px;
  flex: 1;
}

.detail-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: center;
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

