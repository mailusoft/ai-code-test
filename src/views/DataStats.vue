<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>📈 数据统计模块</h1>
        <p class="header-subtitle">发动机数据分析与可视化</p>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ totalEngines }}</span>
          <span class="stat-label">发动机总数</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ filteredEngines.length }}</span>
          <span class="stat-label">当前显示</span>
        </div>
      </div>
    </div>

    <div class="page-content">
      <!-- 主标签页 -->
      <div class="main-tabs">
        <div class="tabs-header">
          <button 
            @click="activeMainTab = 'engine-list'"
            :class="['tab-button', { active: activeMainTab === 'engine-list' }]"
          >
            <span class="tab-icon">📋</span>
            <span class="tab-text">发动机列表</span>
          </button>
          <button 
            @click="activeMainTab = 'single-engine'"
            :class="['tab-button', { active: activeMainTab === 'single-engine' }]"
          >
            <span class="tab-icon">📊</span>
            <span class="tab-text">单台发动机时序图</span>
          </button>
          <button 
            @click="activeMainTab = 'multi-engine'"
            :class="['tab-button', { active: activeMainTab === 'multi-engine' }]"
          >
            <span class="tab-icon">📈</span>
            <span class="tab-text">多台发动机时序图</span>
          </button>
          <button 
            @click="activeMainTab = 'statistics'"
            :class="['tab-button', { active: activeMainTab === 'statistics' }]"
          >
            <span class="tab-icon">📉</span>
            <span class="tab-text">时刻统计图</span>
          </button>
        </div>

        <div class="tabs-content">
          <!-- 1. 发动机列表 -->
          <div v-show="activeMainTab === 'engine-list'" class="tab-panel">
            <div class="panel-header">
              <h2>发动机列表</h2>
              <div class="panel-actions">
                <button @click="resetFilters" class="btn btn-secondary">重置筛选</button>
                <button @click="exportData" class="btn btn-primary">导出数据</button>
              </div>
            </div>

            <!-- 筛选区域 -->
            <div class="filter-section">
              <div class="filter-row">
                <div class="filter-item">
                  <label>发动机编号</label>
                  <input 
                    v-model="filters.engineNumber" 
                    type="text" 
                    placeholder="输入发动机编号"
                    class="filter-input"
                  />
                </div>
                <div class="filter-item">
                  <label>台架编号</label>
                  <input 
                    v-model="filters.testBenchNumber" 
                    type="text" 
                    placeholder="输入台架编号"
                    class="filter-input"
                  />
                </div>
                <div class="filter-item">
                  <label>测试流水号</label>
                  <input 
                    v-model="filters.testSerialNumber" 
                    type="text" 
                    placeholder="输入测试流水号"
                    class="filter-input"
                  />
                </div>
                <div class="filter-item">
                  <label>测试日期</label>
                  <input 
                    v-model="filters.testDate" 
                    type="date" 
                    class="filter-input"
                  />
                </div>
                <div class="filter-item">
                  <label>测试结果</label>
                  <select v-model="filters.testResult" class="filter-select">
                    <option value="">全部</option>
                    <option value="normal">正常</option>
                    <option value="abnormal">异常</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 发动机表格 -->
            <div class="table-container">
              <table class="engine-table">
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>发动机编号</th>
                    <th>台架编号</th>
                    <th>测试流水号</th>
                    <th>测试日期</th>
                    <th>测试结果</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(engine, index) in paginatedEngines" 
                    :key="engine.id"
                    @click="selectEngine(engine)"
                    :class="{ selected: selectedEngine?.id === engine.id }"
                    class="table-row"
                  >
                    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                    <td>{{ engine.engineNumber }}</td>
                    <td>{{ engine.testBenchNumber }}</td>
                    <td>{{ engine.testSerialNumber }}</td>
                    <td>{{ engine.testDate }}</td>
                    <td>
                      <span :class="['status-badge', engine.testResult]">
                        {{ engine.testResult === 'normal' ? '正常' : '异常' }}
                      </span>
                    </td>
                    <td>
                      <button @click.stop="viewEngineDetails(engine)" class="btn-view">查看详情</button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- 分页 -->
              <div class="pagination">
                <button 
                  @click="currentPage--" 
                  :disabled="currentPage === 1"
                  class="page-btn"
                >
                  上一页
                </button>
                <span class="page-info">
                  第 {{ currentPage }} / {{ totalPages }} 页，共 {{ filteredEngines.length }} 条
                </span>
                <button 
                  @click="currentPage++" 
                  :disabled="currentPage === totalPages"
                  class="page-btn"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>

          <!-- 2. 单台发动机指标时序图 -->
          <div v-show="activeMainTab === 'single-engine'" class="tab-panel">
            <div class="panel-header">
              <h2>单台发动机指标时序图</h2>
            </div>

            <!-- 选择区域 -->
            <div class="selection-section">
              <div class="selection-row">
                <div class="selection-item">
                  <label>选择发动机</label>
                  <select v-model="singleEngineConfig.engineId" class="selection-input">
                    <option value="">请选择发动机</option>
                    <option 
                      v-for="engine in engines" 
                      :key="engine.id" 
                      :value="engine.id"
                    >
                      {{ engine.engineNumber }}
                    </option>
                  </select>
                </div>
                <div class="selection-item">
                  <label>选择指标（可多选）</label>
                  <div class="checkbox-group">
                    <label 
                      v-for="metric in availableMetrics" 
                      :key="metric"
                      class="checkbox-label"
                    >
                      <input 
                        type="checkbox" 
                        :value="metric"
                        v-model="singleEngineConfig.selectedMetrics"
                      />
                      <span>{{ metric }}</span>
                    </label>
                  </div>
                </div>
                <div class="selection-item">
                  <label>归一化</label>
                  <label class="switch-label">
                    <input 
                      type="checkbox" 
                      v-model="singleEngineConfig.normalize"
                    />
                    <span>启用归一化</span>
                  </label>
                </div>
                <button @click="loadSingleEngineChart" class="btn btn-primary">加载图表</button>
              </div>
            </div>

            <!-- 图表区域 -->
            <div class="chart-container">
              <div v-if="singleEngineChart" class="chart-wrapper">
                <h3 class="chart-title">
                  {{ selectedEngine?.engineNumber || '未选择发动机' }} - 指标时序图
                </h3>
                <v-chart class="chart" :option="singleEngineChart" autoresize />
              </div>
              <div v-else class="empty-chart">
                <p>请选择发动机和指标后加载图表</p>
              </div>
            </div>
          </div>

          <!-- 3. 多台发动机指标时序图 -->
          <div v-show="activeMainTab === 'multi-engine'" class="tab-panel">
            <div class="panel-header">
              <h2>多台发动机指标时序图</h2>
            </div>

            <!-- 选择区域 -->
            <div class="selection-section">
              <div class="selection-row">
                <div class="selection-item">
                  <label>选择阶段</label>
                  <select v-model="multiEngineConfig.stage" class="selection-input">
                    <option value="">请选择阶段</option>
                    <option value="stage1">阶段1</option>
                    <option value="stage2">阶段2</option>
                    <option value="stage3">阶段3</option>
                    <option value="stage4">阶段4</option>
                  </select>
                </div>
                <div class="selection-item">
                  <label>选择指标</label>
                  <select v-model="multiEngineConfig.metric" class="selection-input">
                    <option value="">请选择指标</option>
                    <option 
                      v-for="metric in availableMetrics" 
                      :key="metric" 
                      :value="metric"
                    >
                      {{ metric }}
                    </option>
                  </select>
                </div>
                <div class="selection-item">
                  <label>选择发动机（可多选）</label>
                  <div class="engine-selector">
                    <div class="selector-header">
                      <input 
                        type="text" 
                        v-model="engineSearchText"
                        placeholder="搜索发动机..."
                        class="search-input"
                      />
                      <button @click="selectAllEngines" class="btn-small">全选</button>
                      <button @click="clearEngineSelection" class="btn-small">清空</button>
                    </div>
                    <div class="selector-list">
                      <label 
                        v-for="engine in filteredEngineList" 
                        :key="engine.id"
                        class="checkbox-label"
                      >
                        <input 
                          type="checkbox" 
                          :value="engine.id"
                          v-model="multiEngineConfig.selectedEngineIds"
                        />
                        <span>{{ engine.engineNumber }}</span>
                      </label>
                    </div>
                    <div class="selector-info">
                      已选择 {{ multiEngineConfig.selectedEngineIds.length }} 台发动机
                    </div>
                  </div>
                </div>
                <button @click="loadMultiEngineChart" class="btn btn-primary">加载图表</button>
              </div>
            </div>

            <!-- 图表区域 -->
            <div class="chart-container">
              <div v-if="multiEngineChart" class="chart-wrapper">
                <h3 class="chart-title">
                  {{ multiEngineConfig.metric }} - 多台发动机时序图
                </h3>
                <v-chart class="chart" :option="multiEngineChart" autoresize />
              </div>
              <div v-else class="empty-chart">
                <p>请选择阶段、指标和发动机后加载图表</p>
              </div>
            </div>
          </div>

          <!-- 4. 单个时刻各发动机指标统计图 -->
          <div v-show="activeMainTab === 'statistics'" class="tab-panel">
            <div class="panel-header">
              <h2>单个时刻各发动机指标统计图</h2>
            </div>

            <!-- 选择区域 -->
            <div class="selection-section">
              <div class="selection-row">
                <div class="selection-item">
                  <label>选择阶段</label>
                  <select v-model="statisticsConfig.stage" class="selection-input">
                    <option value="">请选择阶段</option>
                    <option value="stage1">阶段1</option>
                    <option value="stage2">阶段2</option>
                    <option value="stage3">阶段3</option>
                    <option value="stage4">阶段4</option>
                  </select>
                </div>
                <div class="selection-item">
                  <label>选择时刻</label>
                  <input 
                    v-model="statisticsConfig.moment" 
                    type="number" 
                    step="0.1"
                    placeholder="输入时刻值"
                    class="selection-input"
                  />
                </div>
                <div class="selection-item">
                  <label>选择指标</label>
                  <select v-model="statisticsConfig.metric" class="selection-input">
                    <option value="">请选择指标</option>
                    <option 
                      v-for="metric in availableMetrics" 
                      :key="metric" 
                      :value="metric"
                    >
                      {{ metric }}
                    </option>
                  </select>
                </div>
                <div class="selection-item">
                  <label>测试时间范围</label>
                  <div class="date-range">
                    <input 
                      v-model="statisticsConfig.dateStart" 
                      type="date" 
                      class="date-input"
                      placeholder="开始日期"
                    />
                    <span>至</span>
                    <input 
                      v-model="statisticsConfig.dateEnd" 
                      type="date" 
                      class="date-input"
                      placeholder="结束日期"
                    />
                  </div>
                </div>
                <div class="selection-item">
                  <label>区间数量</label>
                  <input 
                    v-model.number="statisticsConfig.bins" 
                    type="number" 
                    min="5"
                    max="50"
                    class="selection-input"
                  />
                </div>
                <button @click="loadStatisticsChart" class="btn btn-primary">加载图表</button>
              </div>
            </div>

            <!-- 图表区域 -->
            <div class="chart-container">
              <div v-if="statisticsChart" class="chart-wrapper">
                <h3 class="chart-title">
                  {{ statisticsConfig.metric }} - 时刻 {{ statisticsConfig.moment }} 的分布统计
                </h3>
                <v-chart class="chart" :option="statisticsChart" autoresize />
              </div>
              <div v-else class="empty-chart">
                <p>请选择阶段、时刻、指标和时间范围后加载图表</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { 
  getDataTree, 
  getCsvByFile, 
  getDataTypes,
  getEngines,
  getAllEngines,
  getStatistics
} from '../services/api'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
])

export default {
  name: 'DataStats',
  components: {
    VChart
  },
  data() {
    return {
      loading: false,
      error: null,
      apiBaseUrl: '/api',
      fileTree: null, // 文件树缓存
      
      // 主标签页
      activeMainTab: 'engine-list',
      
      // 统计数据
      totalEngines: 0,
      engines: [],
      filteredEngines: [],
      selectedEngine: null,
      
      // 筛选条件
      filters: {
        engineNumber: '',
        testBenchNumber: '',
        testSerialNumber: '',
        testDate: '',
        testResult: ''
      },
      
      // 分页
      currentPage: 1,
      pageSize: 20,
      
      // 可用指标列表（从后端获取）
      availableMetrics: [],
      
      // 单台发动机配置
      singleEngineConfig: {
        engineId: '',
        selectedMetrics: [],
        normalize: false
      },
      singleEngineChart: null,
      
      // 多台发动机配置
      multiEngineConfig: {
        stage: '',
        metric: '',
        selectedEngineIds: []
      },
      multiEngineChart: null,
      engineSearchText: '',
      
      // 统计图配置
      statisticsConfig: {
        stage: '',
        moment: null,
        metric: '',
        dateStart: '',
        dateEnd: '',
        bins: 10
      },
      statisticsChart: null
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredEngines.length / this.pageSize)
    },
    paginatedEngines() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredEngines.slice(start, end)
    },
    filteredEngineList() {
      if (!this.engineSearchText) {
        return this.engines
      }
      const search = this.engineSearchText.toLowerCase()
      return this.engines.filter(engine => 
        engine.engineNumber.toLowerCase().includes(search)
      )
    }
  },
  mounted() {
    this.loadData()
  },
  watch: {
    filters: {
      handler() {
        this.applyFilters()
        this.currentPage = 1
      },
      deep: true
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      this.error = null
      
      try {
        // 测试后端连接
        const testResponse = await fetch(`${this.apiBaseUrl}/`)
        if (!testResponse.ok) {
          throw new Error('无法连接到后端服务')
        }
        
        // 加载文件树（用于动态查找文件路径）
        try {
          this.fileTree = await getDataTree('data', 4, true)
          console.log('文件树加载成功')
          // 打印文件树结构用于调试
          this.printFileTree(this.fileTree, 0)
        } catch (error) {
          console.warn('加载文件树失败:', error)
        }
        
        // 加载发动机列表（从后端获取）
        await this.loadEngines()
        
        // 加载可用指标列表
        await this.loadAvailableMetrics()
      } catch (error) {
        console.error('加载数据失败:', error)
        this.error = error.message || '加载数据失败'
        // 使用模拟数据
        this.loadMockData()
      } finally {
        this.loading = false
      }
    },
    
    // 统一的路径修正函数：将 OSTATIC1（字母O）替换为 0STATIC1（数字0）
    correctFilePath(path) {
      if (!path) return path
      // 将路径中的 OSTATIC1（字母O）替换为 0STATIC1（数字0）
      // 注意：需要处理多种情况：路径开头、路径中间、Windows路径分隔符
      let corrected = String(path)
      // 替换路径开头的 OSTATIC1/
      corrected = corrected.replace(/^OSTATIC1\//gi, '0STATIC1/')
      // 替换路径中间的 /OSTATIC1/
      corrected = corrected.replace(/\/OSTATIC1\//gi, '/0STATIC1/')
      // 替换 Windows 路径分隔符的 \OSTATIC1\
      corrected = corrected.replace(/\\OSTATIC1\\/gi, '\\0STATIC1\\')
      // 替换路径开头的 OSTATIC1\（Windows路径）
      corrected = corrected.replace(/^OSTATIC1\\/gi, '0STATIC1\\')
      // 如果路径被修正了，记录日志
      if (corrected !== path) {
        console.log(`[路径修正] ${path} -> ${corrected}`)
      }
      return corrected
    },
    
    // 打印文件树结构（用于调试）
    printFileTree(node, depth = 0, maxDepth = 3) {
      if (depth > maxDepth) return
      const indent = '  '.repeat(depth)
      const type = node.type === 'file' ? '📄' : '📁'
      console.log(`${indent}${type} ${node.name}${node.type === 'file' ? ` (${node.path})` : ''}`)
      if (node.children && depth < maxDepth) {
        node.children.forEach(child => {
          this.printFileTree(child, depth + 1, maxDepth)
        })
      }
    },
    
    // 在文件树中查找文件路径
    findFileInTree(tree, targetNames, dataType = null) {
      if (!tree || !tree.children) return null
      
      // 递归查找
      const search = (node, currentPath = '') => {
        if (!node.children) return null
        
        for (const child of node.children) {
          const childPath = currentPath ? `${currentPath}/${child.name}` : child.name
          
          // 检查文件名是否匹配
          const fileName = child.name.toLowerCase()
          for (const target of targetNames) {
            const targetLower = target.toLowerCase().replace('.csv', '')
            
            // 匹配文件名（不区分大小写，支持部分匹配）
            if (fileName.includes(targetLower) && child.type === 'file') {
              // 如果指定了dataType，检查路径中是否包含该数据类型
              if (dataType) {
                const pathLower = childPath.toLowerCase()
                const dataTypeLower = dataType.toLowerCase()
                // 路径中应该包含数据类型，或者文件名本身就包含数据类型
                if (!pathLower.includes(dataTypeLower) && !fileName.includes(dataTypeLower)) {
                  continue
                }
              }
              
              // 找到匹配的文件，返回相对路径
              const fullPath = child.path
              // 提取相对于data目录的路径
              let relativePath = fullPath
              const dataIndex = fullPath.indexOf('data/')
              if (dataIndex !== -1) {
                relativePath = fullPath.substring(dataIndex + 5) // 跳过 'data/'
              } else if (fullPath.startsWith('data/')) {
                relativePath = fullPath.substring(5)
              }
              
              // 将路径中的反斜杠替换为正斜杠（Windows路径兼容）
              relativePath = relativePath.replace(/\\/g, '/')
              
              // 使用统一的路径修正函数
              relativePath = this.correctFilePath(relativePath)
              
              console.log(`找到文件: ${child.name}, 路径: ${relativePath}`)
              return relativePath
            }
          }
          
          // 递归搜索子节点
          if (child.children) {
            const result = search(child, childPath)
            if (result) return result
          }
        }
        return null
      }
      
      return search(tree)
    },
    
    async loadEngines() {
      try {
        // 获取所有数据类型
        const dataTypes = await getDataTypes()
        if (!dataTypes || dataTypes.length === 0) {
          console.warn('未找到数据类型，使用模拟数据')
          this.loadMockEngines()
          return
        }
        
        // 从所有CSV文件中提取引擎信息
        const enginesMap = new Map()
        let engineId = 1
        
        // 遍历所有数据类型
        for (const dataType of dataTypes) {
          try {
            // 获取该数据类型的引擎列表
            const enginesResult = await getEngines(dataType.name, 0)
            if (enginesResult.engines && enginesResult.engines.length > 0) {
              enginesResult.engines.forEach(engineNumber => {
                // 如果该引擎还未添加，则添加
                if (!enginesMap.has(engineNumber)) {
                  enginesMap.set(engineNumber, {
                    id: engineId++,
                    engineNumber: engineNumber,
                    testBenchNumber: `TB-${String(Math.floor((engineId - 1) / 10) + 1).padStart(3, '0')}`,
                    testSerialNumber: `SN-${String(engineId - 1).padStart(6, '0')}`,
                    testDate: new Date(2024, 0, 1 + ((engineId - 1) % 365)).toISOString().split('T')[0],
                    testResult: Math.random() > 0.7 ? 'abnormal' : 'normal',
                    dataType: dataType.name
                  })
                }
              })
            }
          } catch (error) {
            console.warn(`获取数据类型 ${dataType.name} 的引擎列表失败:`, error)
          }
        }
        
        // 转换为数组
        this.engines = Array.from(enginesMap.values())
        this.totalEngines = this.engines.length
        this.filteredEngines = [...this.engines]
        
        if (this.engines.length === 0) {
          console.warn('未找到引擎数据，使用模拟数据')
          this.loadMockEngines()
        }
      } catch (error) {
        console.error('加载发动机列表失败:', error)
        // 使用模拟数据作为备用
        this.loadMockEngines()
      }
    },
    
    loadMockEngines() {
      // 模拟发动机数据
      this.engines = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        engineNumber: `ENG-${String(i + 1).padStart(4, '0')}`,
        testBenchNumber: `TB-${String(Math.floor(i / 10) + 1).padStart(3, '0')}`,
        testSerialNumber: `SN-${String(i + 1).padStart(6, '0')}`,
        testDate: new Date(2024, 0, 1 + (i % 365)).toISOString().split('T')[0],
        testResult: Math.random() > 0.7 ? 'abnormal' : 'normal'
      }))
      this.totalEngines = this.engines.length
      this.filteredEngines = [...this.engines]
    },
    
    async loadAvailableMetrics() {
      try {
        // 获取所有数据类型
        const dataTypes = await getDataTypes()
        if (!dataTypes || dataTypes.length === 0) {
          this.availableMetrics = ['温度', '压力', '转速', '振动', '流量', '功率', '效率']
          return
        }
        
        // 从第一个数据类型中获取列名作为指标
        try {
          const firstDataType = dataTypes[0]
          const enginesResult = await getEngines(firstDataType.name, 0)
          
          // 指标就是引擎编号（列名）
          // 但为了更好的显示，我们可以使用引擎编号作为指标
          if (enginesResult.engines && enginesResult.engines.length > 0) {
            this.availableMetrics = enginesResult.engines
          } else {
            // 如果获取不到，尝试从CSV文件读取列名
            // 这里需要知道文件名，暂时使用默认值
            this.availableMetrics = ['温度', '压力', '转速', '振动', '流量', '功率', '效率']
          }
        } catch (error) {
          console.warn('获取指标列表失败，使用默认值:', error)
          this.availableMetrics = ['温度', '压力', '转速', '振动', '流量', '功率', '效率']
        }
      } catch (error) {
        console.error('加载可用指标列表失败:', error)
        this.availableMetrics = ['温度', '压力', '转速', '振动', '流量', '功率', '效率']
      }
    },
    
    loadMockData() {
      this.loadMockEngines()
      this.loadAvailableMetrics()
    },
    
    applyFilters() {
      this.filteredEngines = this.engines.filter(engine => {
        if (this.filters.engineNumber && 
            !engine.engineNumber.includes(this.filters.engineNumber)) {
          return false
        }
        if (this.filters.testBenchNumber && 
            !engine.testBenchNumber.includes(this.filters.testBenchNumber)) {
          return false
        }
        if (this.filters.testSerialNumber && 
            !engine.testSerialNumber.includes(this.filters.testSerialNumber)) {
          return false
        }
        if (this.filters.testDate && engine.testDate !== this.filters.testDate) {
          return false
        }
        if (this.filters.testResult && engine.testResult !== this.filters.testResult) {
          return false
        }
        return true
      })
    },
    
    resetFilters() {
      this.filters = {
        engineNumber: '',
        testBenchNumber: '',
        testSerialNumber: '',
        testDate: '',
        testResult: ''
      }
    },
    
    selectEngine(engine) {
      this.selectedEngine = engine
      // 切换到单台发动机时序图标签页
      this.activeMainTab = 'single-engine'
      this.singleEngineConfig.engineId = engine.id
    },
    
    viewEngineDetails(engine) {
      this.selectEngine(engine)
    },
    
    selectAllEngines() {
      this.multiEngineConfig.selectedEngineIds = this.filteredEngineList.map(e => e.id)
    },
    
    clearEngineSelection() {
      this.multiEngineConfig.selectedEngineIds = []
    },
    
    async loadSingleEngineChart() {
      if (!this.singleEngineConfig.engineId || 
          this.singleEngineConfig.selectedMetrics.length === 0) {
        alert('请选择发动机和至少一个指标')
        return
      }
      
      try {
        const engine = this.engines.find(e => e.id === this.singleEngineConfig.engineId)
        if (!engine) {
          alert('未找到选定的发动机')
          return
        }
        
        // 获取该发动机的数据类型
        const dataType = engine.dataType || 'EOP-Sw'
        const engineNumber = engine.engineNumber
        
        // 4个阶段对应的文件名模式
        // 注意：根据实际文件结构，OSTATIC阶段可能对应 Vct-Int1.csv, Vct-Int2.csv, Vct-Int3.csv
        const stageFiles = [
          'PREINJA',  // 阶段1
          'OSTATIC1', // 阶段2 - 可能对应 Vct-Int1.csv 或类似文件
          'OSTATIC2', // 阶段3 - 可能对应 Vct-Int2.csv 或类似文件
          'OSTATIC3'  // 阶段4 - 可能对应 Vct-Int3.csv 或类似文件
        ]
        
        // 阶段到文件索引的映射（用于查找 Vct-Int1.csv, Vct-Int2.csv 等）
        const stageToFileIndex = {
          'PREINJA': 0,    // PREINJA.csv
          'OSTATIC1': 1,   // Vct-Int1.csv
          'OSTATIC2': 2,   // Vct-Int2.csv
          'OSTATIC3': 3    // Vct-Int3.csv
        }
        
        const allSeries = []
        const metrics = this.singleEngineConfig.selectedMetrics
        const normalize = this.singleEngineConfig.normalize
        
        // 获取每个阶段的数据
        for (let stageIndex = 0; stageIndex < stageFiles.length; stageIndex++) {
          const stageFile = stageFiles[stageIndex]
          
          try {
            // 动态查找文件路径
            let filename = null
            
            // 优先使用文件树查找
            if (this.fileTree) {
              // 根据实际文件结构，文件名可能是数据类型名称，而不是阶段名
              // 例如：0STATIC1/016VCT-INT/Vct-Int.csv, Vct-Int1.csv, Vct-Int2.csv, Vct-Int3.csv
              // 尝试多种可能的文件名模式
              const possibleNames = []
              
              // 对于OSTATIC阶段，尝试 Vct-Int1.csv, Vct-Int2.csv, Vct-Int3.csv
              if (stageFile.startsWith('OSTATIC')) {
                const fileIndex = stageToFileIndex[stageFile] || 1
                // 尝试多种命名模式
                possibleNames.push(
                  `Vct-Int${fileIndex}.csv`,           // Vct-Int1.csv, Vct-Int2.csv, Vct-Int3.csv
                  `vct-int${fileIndex}.csv`,          // 小写版本
                  `${dataType}${fileIndex}.csv`,      // 016VCT-INT1.csv
                  `${dataType.toLowerCase()}${fileIndex}.csv` // 016vct-int1.csv
                )
              }
              
              // 通用文件名模式
              possibleNames.push(
                `${dataType}.csv`,           // 直接使用数据类型作为文件名
                `${dataType.toLowerCase()}.csv`, // 小写版本
                `${dataType.replace(/-/g, '')}.csv`, // 去掉连字符
                `${stageFile}.csv`,          // 阶段名
                stageFile,                   // 不带.csv扩展名
                `${dataType}/${dataType}.csv`, // 数据类型目录下的数据类型文件
                `${dataType}/${stageFile}.csv`,
                `${stageFile}/${dataType}/${stageFile}.csv`
              )
              
              console.log(`查找阶段 ${stageIndex + 1} 文件，数据类型: ${dataType}, 文件名模式: ${stageFile}, 尝试文件名:`, possibleNames.slice(0, 5))
              
              for (const name of possibleNames) {
                const found = this.findFileInTree(this.fileTree, [name, stageFile, dataType], dataType)
                if (found) {
                  // 使用统一的路径修正函数
                  filename = this.correctFilePath(found)
                  console.log(`从文件树找到文件: ${filename}`)
                  break
                }
              }
            }
            
            // 如果文件树查找失败，尝试常见路径
            if (!filename) {
              console.warn(`文件树中未找到 ${stageFile}，尝试常见路径`)
              // 尝试不同的路径组合
              const pathOptions = []
              
              // 根据实际文件结构：0STATIC1/016VCT-INT/Vct-Int.csv
              // 文件名通常是数据类型名称，而不是阶段名
              const zeroStatic = '0STATIC1' // 所有文件都在0STATIC1目录下
              
              // 对于OSTATIC阶段，尝试多种可能的路径
              if (stageFile.startsWith('OSTATIC')) {
                const fileIndex = stageToFileIndex[stageFile] || 1
                // 根据实际文件结构，文件名可能是 Vct-Int1.csv, Vct-Int2.csv, Vct-Int3.csv
                pathOptions.push(
                  `${zeroStatic}/${dataType}/Vct-Int${fileIndex}.csv`,        // 0STATIC1/016VCT-INT/Vct-Int1.csv (优先级最高)
                  `${zeroStatic}/${dataType}/vct-int${fileIndex}.csv`,         // 0STATIC1/016VCT-INT/vct-int1.csv
                  `${zeroStatic}/${dataType}/${dataType}${fileIndex}.csv`,     // 0STATIC1/016VCT-INT/016VCT-INT1.csv
                  `${zeroStatic}/${dataType}/${dataType}.csv`,                 // 0STATIC1/016VCT-INT/016VCT-INT.csv
                  `${zeroStatic}/${dataType}/${dataType.toLowerCase()}.csv`,  // 0STATIC1/016VCT-INT/vct-int.csv
                  `${zeroStatic}/06${stageFile}/${stageFile}.csv`,             // 0STATIC1/06OSTATIC1/OSTATIC1.csv
                  `${zeroStatic}/${dataType}/${stageFile}.csv`,                // 0STATIC1/016VCT-INT/OSTATIC1.csv
                  `${zeroStatic}/${stageFile}/${stageFile}.csv`                // 0STATIC1/OSTATIC1/OSTATIC1.csv
                )
              } else if (stageFile === 'PREINJA') {
                // PREINJA在0STATIC1目录下，格式：0STATIC1/06PREINJA/PREINJA.csv
                pathOptions.push(
                  `0STATIC1/06${stageFile}/${stageFile}.csv`,           // 0STATIC1/06PREINJA/PREINJA.csv
                  `0STATIC1/${dataType}/${dataType}.csv`,               // 0STATIC1/016VCT-INT/016VCT-INT.csv
                  `0STATIC1/${dataType}/${stageFile}.csv`,              // 0STATIC1/016VCT-INT/PREINJA.csv
                  `0STATIC1/${stageFile}/${stageFile}.csv`              // 0STATIC1/PREINJA/PREINJA.csv
                )
              }
              
              // 通用路径（移除可能错误的路径）
              // 注意：不要使用 ${stageFile} 作为目录名，因为stageFile可能是OSTATIC1（字母O）
              // 应该统一使用 0STATIC1（数字0）
              if (!pathOptions.length) {
                // 如果上面的条件都没有匹配，使用通用路径
                pathOptions.push(
                  `0STATIC1/${dataType}/${stageFile}.csv`,
                  `${dataType}/${stageFile}.csv`
                )
              }
              
              // 尝试所有路径，直到找到存在的文件
              console.log(`尝试以下路径:`, pathOptions)
              if (pathOptions.length > 0) {
                filename = pathOptions[0] // 先使用第一个，如果失败会在catch中处理
                // 使用统一的路径修正函数
                filename = this.correctFilePath(filename)
                console.log(`使用备选路径: ${filename}`)
              } else {
                console.error(`无法构建有效路径，stageFile: ${stageFile}, dataType: ${dataType}`)
              }
            }
            
            // 最终验证和修正路径
            if (filename) {
              filename = this.correctFilePath(filename)
              console.log(`最终使用的文件路径: ${filename}`)
            } else {
              console.error(`无法找到阶段 ${stageIndex + 1} 的文件，stageFile: ${stageFile}, dataType: ${dataType}`)
              continue // 跳过这个阶段
            }
            
            // 获取该阶段的数据（使用发动机编号作为列名）
            console.log(`请求数据: 文件=${filename}, 列=${engineNumber}`)
            
            let response = null
            let lastError = null
            
            // 如果文件树已经找到文件，直接使用；否则尝试多个备选路径
            // 注意：如果 filename 已经设置（从文件树找到），直接使用它，不要再尝试其他路径
            const fileFoundInTree = filename && this.fileTree && (filename.includes('Vct-Int') || filename.includes('PREINJA'))
            
            if (!fileFoundInTree) {
              const pathOptions = []
              
              // 构建所有可能的路径
              // 根据实际文件结构：0STATIC1/016VCT-INT/Vct-Int.csv
              // 文件名通常是数据类型名称，而不是阶段名
              const zeroStatic = '0STATIC1'
              
              if (stageFile.startsWith('OSTATIC')) {
                // 根据实际文件结构，文件名可能是数据类型名称
                pathOptions.push(
                  `${zeroStatic}/${dataType}/${dataType}.csv`,           // 0STATIC1/016VCT-INT/016VCT-INT.csv
                  `${zeroStatic}/${dataType}/${dataType.toLowerCase()}.csv`, // 0STATIC1/016VCT-INT/vct-int.csv
                  `${zeroStatic}/06${stageFile}/${stageFile}.csv`,        // 0STATIC1/06OSTATIC1/OSTATIC1.csv
                  `${zeroStatic}/${dataType}/${stageFile}.csv`,           // 0STATIC1/016VCT-INT/OSTATIC1.csv
                  `${zeroStatic}/${stageFile}/${stageFile}.csv`           // 0STATIC1/OSTATIC1/OSTATIC1.csv
                )
              } else if (stageFile === 'PREINJA') {
                pathOptions.push(
                  `0STATIC1/06${stageFile}/${stageFile}.csv`,             // 0STATIC1/06PREINJA/PREINJA.csv
                  `0STATIC1/${dataType}/${dataType}.csv`,                 // 0STATIC1/016VCT-INT/016VCT-INT.csv
                  `0STATIC1/${dataType}/${stageFile}.csv`,                // 0STATIC1/016VCT-INT/PREINJA.csv
                  `0STATIC1/${stageFile}/${stageFile}.csv`                // 0STATIC1/PREINJA/PREINJA.csv
                )
              }
              
              // 尝试所有路径
              for (const pathOption of pathOptions) {
                try {
                  // 使用统一的路径修正函数
                  const correctedPath = this.correctFilePath(pathOption)
                  console.log(`尝试路径: ${correctedPath}`)
                  response = await getCsvByFile(
                    correctedPath,
                    [engineNumber],
                    10000,
                    0
                  )
                  console.log(`成功使用路径: ${correctedPath}`)
                  filename = correctedPath // 更新filename为成功的路径
                  break
                } catch (error) {
                  lastError = error
                  // 如果是列名不存在的错误，记录但继续尝试其他路径
                  if (error.message && error.message.includes('不存在于文件中')) {
                    console.warn(`路径 ${pathOption} 中列 ${engineNumber} 不存在，继续尝试其他路径`)
                  } else {
                    console.warn(`路径 ${pathOption} 失败:`, error.message)
                  }
                  continue
                }
              }
            }
            
            // 如果上面的循环没有成功，使用原始filename再试一次
            if (!response && filename) {
              try {
                // 使用统一的路径修正函数
                const correctedFilename = this.correctFilePath(filename)
                if (correctedFilename !== filename) {
                  console.log(`使用修正后的路径重试: ${correctedFilename}`)
                }
                response = await getCsvByFile(
                  correctedFilename,
                  [engineNumber], // 使用发动机编号作为指标列
                  10000, // 获取足够多的数据点
                  0
                )
                filename = correctedFilename // 更新filename
                console.log(`成功获取阶段 ${stageIndex + 1} 数据，共 ${response.data?.length || 0} 条记录`)
              } catch (error) {
                lastError = error
                // 如果是列名不存在的错误，提供更友好的错误信息
                if (error.message && error.message.includes('不存在于文件中')) {
                  console.warn(`阶段 ${stageIndex + 1} (${stageFile}) 的文件 ${filename} 中不存在列 ${engineNumber}，跳过该阶段`)
                  // 尝试获取文件的第一行来查看实际列名（用于调试）
                  try {
                    // 先尝试获取文件的第一列（通常是时间列）来获取文件结构
                    // 注意：后端API要求至少一个列名，所以我们使用一个通用的列名尝试
                    // 如果失败，至少我们知道文件存在但列名不匹配
                    const testResponse = await getCsvByFile(correctedFilename, ['time'], 1, 0)
                    if (testResponse && testResponse.columns && testResponse.columns.length > 0) {
                      const availableColumns = testResponse.columns.filter(col => col.toLowerCase() !== 'time') // 排除时间列
                      if (availableColumns.length > 0) {
                        console.log(`文件 ${filename} 的可用列（前10个）: ${availableColumns.slice(0, 10).join(', ')}${availableColumns.length > 10 ? `... (共${availableColumns.length}列)` : ` (共${availableColumns.length}列)`}`)
                        // 检查是否有类似的列名
                        const similarColumns = availableColumns.filter(col => 
                          col.includes(engineNumber.substring(0, 5)) || 
                          engineNumber.includes(col.substring(0, 5))
                        )
                        if (similarColumns.length > 0) {
                          console.log(`找到类似的列名: ${similarColumns.join(', ')}`)
                        } else {
                          console.log(`提示: 未找到与 ${engineNumber} 类似的列名`)
                        }
                      }
                    }
                  } catch (testError) {
                    // 如果连时间列都获取不到，说明文件可能有问题
                    // 但我们已经知道文件存在（因为之前的错误是列名不存在，不是文件不存在）
                    console.debug('无法获取文件列信息（可能文件格式不同）:', testError.message)
                  }
                  continue // 跳过这个阶段，继续处理下一个阶段
                }
                throw error // 重新抛出其他错误，让外层catch处理
              }
            }
            
            // 如果仍然没有响应，跳过这个阶段
            if (!response) {
              console.warn(`阶段 ${stageIndex + 1} (${stageFile}) 无法获取数据，跳过该阶段`)
              continue
            } else {
              console.log(`成功获取阶段 ${stageIndex + 1} 数据，共 ${response.data?.length || 0} 条记录`)
            }
            
            if (response.data && response.data.length > 0) {
              // 处理每个指标的数据
              metrics.forEach((metric, metricIndex) => {
                // 如果指标是发动机编号，使用该列的数据
                const metricColumn = metric === engineNumber ? engineNumber : metric
                
                if (!response.columns.includes(metricColumn)) {
                  return
                }
                
                const timeCol = response.columns[0] // 第一列是时间
                let timeOffset = 0
                // 为每个阶段添加时间偏移，使各阶段连续显示
                if (stageIndex > 0) {
                  // 计算前一个阶段的最大时间
                  const prevStageData = allSeries.find(s => s.name === metric)?.data || []
                  if (prevStageData.length > 0) {
                    timeOffset = Math.max(...prevStageData.map(d => d[0])) + 1
                  }
                }
                
                const metricData = response.data.map(row => [
                  row[timeCol] + timeOffset,
                  normalize ? this.normalizeValue(row[metricColumn], metrics) : row[metricColumn]
                ])
                
                // 查找或创建该指标的系列
                let series = allSeries.find(s => s.name === metric)
                if (!series) {
                  const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452']
                  series = {
                    name: metric,
                    type: 'line',
                    data: [],
                    smooth: true,
                    lineStyle: {
                      color: colors[metricIndex % colors.length]
                    }
                  }
                  allSeries.push(series)
                }
                
                // 合并数据
                series.data = series.data.concat(metricData)
              })
            }
          } catch (error) {
            console.warn(`获取阶段 ${stageIndex + 1} 数据失败:`, error)
          }
        }
        
        // 如果获取到数据，生成图表
        if (allSeries.length > 0) {
          // 对每个系列的数据按时间排序
          allSeries.forEach(series => {
            series.data.sort((a, b) => a[0] - b[0])
          })
          
          this.singleEngineChart = {
            title: {
              text: `发动机 ${engine.engineNumber} 指标时序图`,
              left: 'center'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: metrics,
              top: 30
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              top: '15%'
            },
            xAxis: {
              type: 'value',
              name: '时间 (秒)',
              splitLine: {
                show: true
              }
            },
            yAxis: {
              type: 'value',
              name: normalize ? '归一化值' : '指标值',
              splitLine: {
                show: true
              }
            },
            dataZoom: [
              {
                type: 'inside',
                start: 0,
                end: 100
              },
              {
                type: 'slider',
                start: 0,
                end: 100
              }
            ],
            series: allSeries
          }
        } else {
          // 如果获取不到数据，使用模拟数据
          this.singleEngineChart = this.generateSingleEngineChart()
        }
      } catch (error) {
        console.error('加载单台发动机图表失败:', error)
        alert('加载数据失败，使用模拟数据')
        this.singleEngineChart = this.generateSingleEngineChart()
      }
    },
    
    // 归一化函数
    normalizeValue(value, allMetrics) {
      // 简单的归一化：将值映射到0-1范围
      // 这里可以根据实际需求调整
      return value / 200 // 假设最大值约为200
    },
    
    generateSingleEngineChart() {
      const metrics = this.singleEngineConfig.selectedMetrics
      const normalize = this.singleEngineConfig.normalize
      
      // 模拟数据：4个阶段
      const stages = ['阶段1', '阶段2', '阶段3', '阶段4']
      const series = []
      
      metrics.forEach((metric, index) => {
        const data = []
        stages.forEach((stage, stageIndex) => {
          const stageStart = stageIndex * 100
          const stageEnd = (stageIndex + 1) * 100
          for (let t = stageStart; t < stageEnd; t += 5) {
            const value = Math.sin(t / 10) * (50 + Math.random() * 20) + 100
            data.push([t, normalize ? value / 200 : value])
          }
        })
        
        const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452']
        series.push({
          name: metric,
          type: 'line',
          data: data,
          smooth: true,
          lineStyle: {
            color: colors[index % colors.length]
          }
        })
      })
      
      return {
        title: {
          text: '单台发动机指标时序图',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: metrics,
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '时间 (秒)',
          splitLine: {
            show: true
          }
        },
        yAxis: {
          type: 'value',
          name: normalize ? '归一化值' : '指标值',
          splitLine: {
            show: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            type: 'slider',
            start: 0,
            end: 100
          }
        ],
        series: series
      }
    },
    
    async loadMultiEngineChart() {
      if (!this.multiEngineConfig.stage || 
          !this.multiEngineConfig.metric ||
          this.multiEngineConfig.selectedEngineIds.length === 0) {
        alert('请选择阶段、指标和至少一台发动机')
        return
      }
      
      try {
        const selectedEngines = this.engines.filter(e => 
          this.multiEngineConfig.selectedEngineIds.includes(e.id)
        )
        
        if (selectedEngines.length === 0) {
          alert('未找到选定的发动机')
          return
        }
        
        // 阶段文件映射
        const stageFileMap = {
          '阶段1': 'PREINJA',
          '阶段2': 'OSTATIC1',
          '阶段3': 'OSTATIC2',
          '阶段4': 'OSTATIC3'
        }
        
        const stageFile = stageFileMap[this.multiEngineConfig.stage]
        if (!stageFile) {
          alert('无效的阶段选择')
          return
        }
        
        const metric = this.multiEngineConfig.metric
        const series = []
        const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
        
        // 获取每台发动机的数据
        for (let i = 0; i < selectedEngines.length; i++) {
          const engine = selectedEngines[i]
          const dataType = engine.dataType || 'EOP-Sw'
          
          try {
            // 动态查找文件路径
            let filename = null
            
            // 优先使用文件树查找
            if (this.fileTree) {
              const possibleNames = [
                `${stageFile}.csv`,
                `${dataType}/${stageFile}.csv`,
                `${stageFile}/${dataType}/${stageFile}.csv`
              ]
              
              for (const name of possibleNames) {
                const found = this.findFileInTree(this.fileTree, [name, stageFile], dataType)
                if (found) {
              // 使用统一的路径修正函数
              filename = this.correctFilePath(found)
                  break
                }
              }
            }
            
            // 如果文件树查找失败，尝试常见路径
            if (!filename) {
              const pathOptions = [
                `0STATIC1/${dataType}/${stageFile}.csv`,
                `${stageFile}/${dataType}/${stageFile}.csv`,
                `${dataType}/${stageFile}.csv`
              ]
              
              if (stageFile.startsWith('OSTATIC')) {
                const zeroStatic = '0' + stageFile.substring(1)
                pathOptions.unshift(
                  `${zeroStatic}/${dataType}/${stageFile}.csv`
                )
              }
              
              if (pathOptions.length > 0) {
                filename = pathOptions[0]
                // 使用统一的路径修正函数
                filename = this.correctFilePath(filename)
              }
            }
            
            // 获取数据前再次验证路径
            if (filename) {
              filename = this.correctFilePath(filename)
            }
            
            const response = await getCsvByFile(
              filename,
              [metric],
              10000,
              0
            )
            
            if (response.data && response.data.length > 0) {
              const timeCol = response.columns[0]
              const metricData = response.data.map(row => [
                row[timeCol],
                row[metric]
              ])
              
              series.push({
                name: engine.engineNumber,
                type: 'line',
                data: metricData,
                smooth: true,
                lineStyle: {
                  color: colors[i % colors.length]
                }
              })
            }
          } catch (error) {
            console.warn(`获取发动机 ${engine.engineNumber} 数据失败:`, error)
          }
        }
        
        if (series.length > 0) {
          this.multiEngineChart = {
            title: {
              text: `${this.multiEngineConfig.metric} - 多台发动机时序图`,
              left: 'center'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: selectedEngines.map(e => e.engineNumber),
              top: 30
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              top: '15%'
            },
            xAxis: {
              type: 'value',
              name: '时间 (秒)'
            },
            yAxis: {
              type: 'value',
              name: this.multiEngineConfig.metric
            },
            dataZoom: [
              {
                type: 'inside',
                start: 0,
                end: 100
              }
            ],
            series: series
          }
        } else {
          // 如果获取不到数据，使用模拟数据
          this.multiEngineChart = this.generateMultiEngineChart()
        }
      } catch (error) {
        console.error('加载多台发动机图表失败:', error)
        alert('加载数据失败，使用模拟数据')
        this.multiEngineChart = this.generateMultiEngineChart()
      }
    },
    
    generateMultiEngineChart() {
      const selectedEngines = this.engines.filter(e => 
        this.multiEngineConfig.selectedEngineIds.includes(e.id)
      )
      
      const series = selectedEngines.map((engine, index) => {
        const data = []
        for (let t = 0; t < 100; t += 2) {
          const value = Math.sin(t / 10 + index) * 20 + 100 + Math.random() * 10
          data.push([t, value])
        }
        
        const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
        return {
          name: engine.engineNumber,
          type: 'line',
          data: data,
          smooth: true,
          lineStyle: {
            color: colors[index % colors.length]
          }
        }
      })
      
      return {
        title: {
          text: `${this.multiEngineConfig.metric} - 多台发动机时序图`,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: selectedEngines.map(e => e.engineNumber),
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '时间 (秒)'
        },
        yAxis: {
          type: 'value',
          name: this.multiEngineConfig.metric
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ],
        series: series
      }
    },
    
    async loadStatisticsChart() {
      if (!this.statisticsConfig.stage || 
          this.statisticsConfig.moment === null ||
          !this.statisticsConfig.metric) {
        alert('请选择阶段、时刻和指标')
        return
      }
      
      try {
        // 阶段文件映射
        const stageFileMap = {
          '阶段1': 'PREINJA',
          '阶段2': 'OSTATIC1',
          '阶段3': 'OSTATIC2',
          '阶段4': 'OSTATIC3'
        }
        
        const stageFile = stageFileMap[this.statisticsConfig.stage]
        if (!stageFile) {
          alert('无效的阶段选择')
          return
        }
        
        const metric = this.statisticsConfig.metric
        const targetTime = this.statisticsConfig.moment
        
        // 获取所有发动机在该时刻的指标值
        const values = []
        
        // 遍历所有发动机（或根据时间范围筛选）
        for (const engine of this.engines) {
          // 如果设置了时间范围筛选，先检查
          if (this.statisticsConfig.dateStart || this.statisticsConfig.dateEnd) {
            const engineDate = new Date(engine.testDate)
            if (this.statisticsConfig.dateStart && engineDate < new Date(this.statisticsConfig.dateStart)) {
              continue
            }
            if (this.statisticsConfig.dateEnd && engineDate > new Date(this.statisticsConfig.dateEnd)) {
              continue
            }
          }
          
          const dataType = engine.dataType || 'EOP-Sw'
          
          try {
            // 动态查找文件路径
            let filename = null
            
            // 优先使用文件树查找
            if (this.fileTree) {
              const possibleNames = [
                `${stageFile}.csv`,
                `${dataType}/${stageFile}.csv`,
                `${stageFile}/${dataType}/${stageFile}.csv`
              ]
              
              for (const name of possibleNames) {
                const found = this.findFileInTree(this.fileTree, [name, stageFile], dataType)
                if (found) {
              // 使用统一的路径修正函数
              filename = this.correctFilePath(found)
                  break
                }
              }
            }
            
            // 如果文件树查找失败，尝试常见路径
            if (!filename) {
              const pathOptions = [
                `0STATIC1/${dataType}/${stageFile}.csv`,
                `${stageFile}/${dataType}/${stageFile}.csv`,
                `${dataType}/${stageFile}.csv`
              ]
              
              if (stageFile.startsWith('OSTATIC')) {
                const zeroStatic = '0' + stageFile.substring(1)
                pathOptions.unshift(
                  `${zeroStatic}/${dataType}/${stageFile}.csv`
                )
              }
              
              if (pathOptions.length > 0) {
                filename = pathOptions[0]
                // 使用统一的路径修正函数
                filename = this.correctFilePath(filename)
              }
            }
            
            // 获取接近目标时刻的数据前再次验证路径
            if (filename) {
              filename = this.correctFilePath(filename)
            }
            
            const response = await getCsvByFile(
              filename,
              [metric],
              10000,
              0
            )
            
            if (response.data && response.data.length > 0) {
              const timeCol = response.columns[0]
              // 找到最接近目标时刻的数据点
              let closestRow = null
              let minDiff = Infinity
              
              for (const row of response.data) {
                const diff = Math.abs(row[timeCol] - targetTime)
                if (diff < minDiff) {
                  minDiff = diff
                  closestRow = row
                }
              }
              
              // 如果找到接近的数据点（误差在1秒内）
              if (closestRow && minDiff <= 1) {
                values.push(closestRow[metric])
              }
            }
          } catch (error) {
            console.warn(`获取发动机 ${engine.engineNumber} 数据失败:`, error)
          }
        }
        
        if (values.length > 0) {
          // 计算直方图数据
          const bins = this.statisticsConfig.bins || 10
          const min = Math.min(...values)
          const max = Math.max(...values)
          const binWidth = (max - min) / bins
          
          const binCounts = new Array(bins).fill(0)
          values.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1)
            binCounts[binIndex]++
          })
          
          const data = []
          for (let i = 0; i < bins; i++) {
            const binStart = min + i * binWidth
            const binEnd = binStart + binWidth
            data.push({
              value: binCounts[i],
              name: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`
            })
          }
          
          this.statisticsChart = {
            title: {
              text: `${this.statisticsConfig.metric} - 时刻 ${this.statisticsConfig.moment} 的分布统计`,
              left: 'center'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              top: '15%'
            },
            xAxis: {
              type: 'category',
              data: data.map(d => d.name),
              name: this.statisticsConfig.metric + ' 值区间'
            },
            yAxis: {
              type: 'value',
              name: '发动机数量'
            },
            series: [
              {
                name: '发动机数量',
                type: 'bar',
                data: data.map(d => d.value),
                itemStyle: {
                  color: (() => {
                    try {
                      if (window.echarts && window.echarts.graphic && window.echarts.graphic.LinearGradient) {
                        return new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          { offset: 0, color: '#83bff6' },
                          { offset: 0.5, color: '#188df0' },
                          { offset: 1, color: '#188df0' }
                        ])
                      }
                    } catch (e) {
                      // fallback
                    }
                    return '#5470c6'
                  })()
                }
              }
            ]
          }
        } else {
          // 如果获取不到数据，使用模拟数据
          this.statisticsChart = this.generateStatisticsChart()
        }
      } catch (error) {
        console.error('加载统计图表失败:', error)
        alert('加载数据失败，使用模拟数据')
        this.statisticsChart = this.generateStatisticsChart()
      }
    },
    
    generateStatisticsChart() {
      // 模拟数据：生成直方图数据
      const bins = this.statisticsConfig.bins || 10
      const data = []
      const min = 50
      const max = 150
      const binWidth = (max - min) / bins
      
      for (let i = 0; i < bins; i++) {
        const binStart = min + i * binWidth
        const binEnd = binStart + binWidth
        const count = Math.floor(Math.random() * 20) + 5
        data.push({
          value: count,
          name: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`
        })
      }
      
      return {
        title: {
          text: `${this.statisticsConfig.metric} - 时刻 ${this.statisticsConfig.moment} 的分布统计`,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(d => d.name),
          name: this.statisticsConfig.metric + ' 值区间'
        },
        yAxis: {
          type: 'value',
          name: '发动机数量'
        },
        series: [
          {
            name: '发动机数量',
            type: 'bar',
            data: data.map(d => d.value),
            itemStyle: {
              color: (() => {
                try {
                  if (window.echarts && window.echarts.graphic && window.echarts.graphic.LinearGradient) {
                    return new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: '#83bff6' },
                      { offset: 0.5, color: '#188df0' },
                      { offset: 1, color: '#188df0' }
                    ])
                  }
                } catch (e) {
                  // fallback
                }
                return '#5470c6'
              })()
            }
          }
        ]
      }
    },
    
    exportData() {
      // TODO: 实现数据导出功能
      alert('导出功能开发中...')
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
}

.header-content h1 {
  margin: 0 0 8px 0;
  color: white;
  font-size: 28px;
  font-weight: 700;
}

.header-subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.header-stats {
  display: flex;
  gap: 30px;
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
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.page-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0; /* 确保flex子元素可以缩小 */
}

/* 自定义滚动条样式 */
.page-content::-webkit-scrollbar {
  width: 8px;
}

.page-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.page-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6c4bb8 100%);
}

.main-tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: visible;
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.tabs-header {
  display: flex;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
}

.tab-button {
  flex: 1;
  padding: 16px 20px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
}

.tab-button:hover {
  background: #e9ecef;
  color: #495057;
}

.tab-button.active {
  background: white;
  color: #667eea;
  border-bottom: 2px solid #667eea;
  margin-bottom: -2px;
}

.tab-icon {
  font-size: 18px;
}

.tabs-content {
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
}

/* 标签页内容滚动条 */
.tabs-content::-webkit-scrollbar {
  width: 8px;
}

.tabs-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.tabs-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.tabs-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6c4bb8 100%);
}

.tab-panel {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.panel-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.panel-actions {
  display: flex;
  gap: 12px;
}

.filter-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.filter-input,
.filter-select {
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  overflow-y: visible;
}

/* 表格容器滚动条 */
.table-container::-webkit-scrollbar {
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6c4bb8 100%);
}

.engine-table {
  width: 100%;
  border-collapse: collapse;
}

.engine-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.engine-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.engine-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.table-row {
  cursor: pointer;
  transition: all 0.2s;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row.selected {
  background: #e7f3ff;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.normal {
  background: #d4edda;
  color: #155724;
}

.status-badge.abnormal {
  background: #f8d7da;
  color: #721c24;
}

.btn-view {
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
}

.page-btn {
  padding: 8px 16px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #6c757d;
}

.selection-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.selection-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  align-items: end;
}

.selection-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selection-item label {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.selection-input {
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  max-height: 120px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 6px;
}

/* 复选框组滚动条 */
.checkbox-group::-webkit-scrollbar {
  width: 6px;
}

.checkbox-group::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.checkbox-group::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.checkbox-group::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.engine-selector {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
  max-height: 200px;
  display: flex;
  flex-direction: column;
}

.selector-header {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;
}

.btn-small {
  padding: 6px 12px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.selector-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

/* 选择器列表滚动条 */
.selector-list::-webkit-scrollbar {
  width: 6px;
}

.selector-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.selector-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.selector-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.selector-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
  font-size: 12px;
  color: #6c757d;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  min-height: 500px;
}

.chart-wrapper {
  width: 100%;
}

.chart-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
    text-align: center;
}

.chart {
  width: 100%;
  height: 500px;
}

.empty-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
  color: #6c757d;
  font-size: 16px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .filter-row,
  .selection-row {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-container {
    width: 100vw;
  }
  
  .tabs-header {
    flex-direction: column;
  }
  
  .filter-row,
  .selection-row {
    grid-template-columns: 1fr;
  }
}
</style>
