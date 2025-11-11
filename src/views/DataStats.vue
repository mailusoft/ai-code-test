<template>
  <div class="page-container">
    <!-- 返回首页按钮 -->
    <div class="back-home-btn" @click="goHome" title="返回首页">
      <span class="back-icon">←</span>
      <span class="back-text">返回首页</span>
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

          <!-- 2. 单台发动机指标时序图（可视化一：单发动机多指标时序） -->
          <div v-show="activeMainTab === 'single-engine'" class="tab-panel">
            <div class="panel-header">
              <h2>单台发动机多指标时序图</h2>
            </div>

            <!-- 选择区域 -->
            <div class="selection-section">
              <div class="selection-row">
                <div class="selection-item">
                  <label>选择阶段</label>
                  <select v-model="singleEngineConfig.stage" class="selection-input" @change="singleEngineConfig.selectedMetrics = []">
                    <option value="">请选择阶段</option>
                    <option value="0static">0static</option>
                    <option value="1hispeed">1hispeed</option>
                    <option value="2lowspeed">2lowspeed</option>
                    <option value="3EOP-RPM">3EOP-RPM</option>
                  </select>
                </div>
                <div class="selection-item">
                  <label>选择发动机（单选）</label>
                  <select v-model="singleEngineConfig.selectedEngineId" class="selection-input">
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
                  <div class="engine-selector">
                    <div class="selector-header">
                      <input 
                        type="text" 
                        v-model="singleEngineMetricSearchText"
                        placeholder="搜索指标..."
                        class="search-input"
                      />
                      <button @click="selectAllMetricsForSingle" class="btn-small">全选</button>
                      <button @click="clearMetricSelectionForSingle" class="btn-small">清空</button>
                    </div>
                    <div class="selector-list">
                      <label 
                        v-for="indicator in filteredMetricsForSingle" 
                        :key="indicator"
                        class="checkbox-label"
                      >
                        <input 
                          type="checkbox" 
                          :value="indicator"
                          v-model="singleEngineConfig.selectedMetrics"
                        />
                        <span>{{ indicator }}</span>
                      </label>
                    </div>
                    <div class="selector-info">
                      已选择 {{ singleEngineConfig.selectedMetrics.length }} 个指标
                    </div>
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
                <div class="selection-item time-range-item">
                  <label>时间范围</label>
                  <div class="time-range-controls">
                    <div class="time-range-slider-container">
                      <div class="time-range-labels">
                        <span>开始: {{ singleEngineConfig.timeStart !== null && singleEngineConfig.timeStart !== undefined ? singleEngineConfig.timeStart.toFixed(1) : '0' }}s</span>
                        <span>结束: {{ singleEngineConfig.timeEnd !== null && singleEngineConfig.timeEnd !== undefined ? singleEngineConfig.timeEnd.toFixed(1) : '180' }}s</span>
                      </div>
                      <div class="time-range-sliders">
                        <div class="slider-group">
                          <label>开始时间</label>
                          <input 
                            type="range" 
                            v-model.number="singleEngineConfig.timeStart" 
                            :min="0"
                            :max="singleEngineConfig.timeEnd !== null && singleEngineConfig.timeEnd !== undefined ? singleEngineConfig.timeEnd : 180"
                            step="0.1"
                            class="time-slider"
                          />
                          <input 
                            type="number" 
                            v-model.number="singleEngineConfig.timeStart" 
                            placeholder="开始时间"
                            step="0.1"
                            :min="0"
                            :max="singleEngineConfig.timeEnd !== null && singleEngineConfig.timeEnd !== undefined ? singleEngineConfig.timeEnd : 180"
                            class="time-input-small"
                          />
                        </div>
                        <div class="slider-group">
                          <label>结束时间</label>
                          <input 
                            type="range" 
                            v-model.number="singleEngineConfig.timeEnd" 
                            :min="singleEngineConfig.timeStart !== null && singleEngineConfig.timeStart !== undefined ? singleEngineConfig.timeStart : 0"
                            :max="180"
                            step="0.1"
                            class="time-slider"
                          />
                          <input 
                            type="number" 
                            v-model.number="singleEngineConfig.timeEnd" 
                            placeholder="结束时间"
                            step="0.1"
                            :min="singleEngineConfig.timeStart !== null && singleEngineConfig.timeStart !== undefined ? singleEngineConfig.timeStart : 0"
                            :max="180"
                            class="time-input-small"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button @click="loadSingleEngineChart" class="btn btn-primary">加载图表</button>
              </div>
            </div>

            <!-- 图表区域 -->
            <div class="chart-container">
              <div v-if="singleEngineChart" class="chart-wrapper">
                <v-chart class="chart" :option="singleEngineChart" autoresize />
              </div>
              <div v-else class="empty-chart">
                <p>请选择阶段、指标和发动机后加载图表</p>
              </div>
            </div>
          </div>

          <!-- 3. 多台发动机指标时序图（可视化二：单指标多台发动机时序） -->
          <div v-show="activeMainTab === 'multi-engine'" class="tab-panel">
            <div class="panel-header">
              <h2>单指标多台发动机时序图</h2>
            </div>

            <!-- 选择区域 -->
            <div class="selection-section">
              <div class="selection-row">
                <div class="selection-item">
                  <label>选择阶段</label>
                  <select v-model="multiEngineConfig.stage" class="selection-input" @change="multiEngineConfig.metric = ''">
                    <option value="">请选择阶段</option>
                    <option value="0static">0static</option>
                    <option value="1hispeed">1hispeed</option>
                    <option value="2lowspeed">2lowspeed</option>
                    <option value="3EOP-RPM">3EOP-RPM</option>
                  </select>
                </div>
                <div class="selection-item">
                  <label>选择指标（单选）</label>
                  <select v-model="multiEngineConfig.metric" class="selection-input" :disabled="!multiEngineConfig.stage">
                    <option value="">请选择指标</option>
                    <option 
                      v-for="indicator in availableIndicators" 
                      :key="indicator" 
                      :value="indicator"
                    >
                      {{ indicator }}
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
                <div class="selection-item time-range-item">
                  <label>时间范围</label>
                  <div class="time-range-controls">
                    <div class="time-range-slider-container">
                      <div class="time-range-labels">
                        <span>开始: {{ multiEngineConfig.timeStart !== null && multiEngineConfig.timeStart !== undefined ? multiEngineConfig.timeStart.toFixed(1) : '0' }}s</span>
                        <span>结束: {{ multiEngineConfig.timeEnd !== null && multiEngineConfig.timeEnd !== undefined ? multiEngineConfig.timeEnd.toFixed(1) : '180' }}s</span>
                      </div>
                      <div class="time-range-sliders">
                        <div class="slider-group">
                          <label>开始时间</label>
                          <input 
                            type="range" 
                            v-model.number="multiEngineConfig.timeStart" 
                            :min="0"
                            :max="multiEngineConfig.timeEnd !== null && multiEngineConfig.timeEnd !== undefined ? multiEngineConfig.timeEnd : 180"
                            step="0.1"
                            class="time-slider"
                          />
                          <input 
                            type="number" 
                            v-model.number="multiEngineConfig.timeStart" 
                            placeholder="开始时间"
                            step="0.1"
                            :min="0"
                            :max="multiEngineConfig.timeEnd !== null && multiEngineConfig.timeEnd !== undefined ? multiEngineConfig.timeEnd : 180"
                            class="time-input-small"
                          />
                        </div>
                        <div class="slider-group">
                          <label>结束时间</label>
                          <input 
                            type="range" 
                            v-model.number="multiEngineConfig.timeEnd" 
                            :min="multiEngineConfig.timeStart !== null && multiEngineConfig.timeStart !== undefined ? multiEngineConfig.timeStart : 0"
                            :max="180"
                            step="0.1"
                            class="time-slider"
                          />
                          <input 
                            type="number" 
                            v-model.number="multiEngineConfig.timeEnd" 
                            placeholder="结束时间"
                            step="0.1"
                            :min="multiEngineConfig.timeStart !== null && multiEngineConfig.timeStart !== undefined ? multiEngineConfig.timeStart : 0"
                            :max="180"
                            class="time-input-small"
                          />
                        </div>
                      </div>
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
      // 阶段和指标的映射关系
      stageIndicatorMap: {
        '0static': [
          '010inj2', '011inj2Rate', '012inj3', '013inj3Rate', '014inj4', '015inj4Rate',
          '016VCT-INT', '017Vct-EXH', '018VMV', '019FVRC', '01GrossElec', '020TCV',
          '021ETBAdapt-V', '022FRPr', '023FRFlow', '024FRP-1L', '024TP-PS', '025MAP-1L',
          '025TP-NS', '026EOP-Sw', '027Ect-Cont', '028IAT-Cont', '029VBAT', '02IgnLF1',
          '030VBAT2', '031Vac', '032VOP', '03IgnLF2', '04IgnLF3', '05IgnLF4',
          '06PREINJA', '07PREINJB', '08inj1', '09inj1Rate'
        ],
        '1hispeed': [
          '110CMP', 'HE_Exh', '111TDC',' Synch', '112HSFRPr', '113HSFRFlow', '114IntVac',
          '115TP_PS', '116TP_NS', '117EOP_Sw', '118VBAT', '119VBAT2', '11GrossVac',
          '120IAT_Cont', '121ECT_Cont', '122Velocity', '123HSVacRaw', '124HSVac4CYL',
          '125Vac_WOT', '12CKP', 'HE_CONT', '13CMP', 'HE_IN_C', '14CMP', 'HE_Ex_C', '15TDC',
          '16EOP',' Sw_Ramp', '17VelocityRamp', '18CKP_HE', '19CMP','HE_INT'
        ],
        '2lowspeed': [
          '310LSRunT4CYL_E', '311Velocity', '312CKP','Final', '313L','NVH_V',
          '314L','NVH','V_FFT', '315L','NVH','V_RMS', '31Vac','HStols', '32TP','PS','Close',
          '33Vel','HStols', '34EOP','Sw_Ramp', '35LSVac_Raw', '36Vac_Def',
          '37TP','PS_Def', '38TP','NS_Def', '39LSRunT','Raw_E'
        ],
        '3EOP-RPM': [
          'EOP-SW','Velocity'
        ]
      },
      
      // 单台发动机配置（可视化一：单发动机多指标时序）
      singleEngineConfig: {
        stage: '',
        selectedEngineId: '',
        selectedMetrics: [],
        normalize: false,
        timeStart: 0,
        timeEnd: 180
      },
      singleEngineMetricSearchText: '',
      singleEngineChart: null,
      
      // 多台发动机配置（可视化二：单指标多台发动机时序）
      multiEngineConfig: {
        stage: '',
        metric: '',
        selectedEngineIds: [],
        timeStart: 0,
        timeEnd: 180
      },
      multiEngineChart: null,
      engineSearchText: ''
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
    },
    // 根据选择的阶段返回可用指标（用于多台发动机时序图）
    availableIndicators() {
      if (!this.multiEngineConfig.stage) {
        return []
      }
      return this.stageIndicatorMap[this.multiEngineConfig.stage] || []
    },
    // 根据选择的阶段返回可用指标（用于单台发动机时序图）
    availableIndicatorsForSingle() {
      if (!this.singleEngineConfig.stage) {
        return []
      }
      return this.stageIndicatorMap[this.singleEngineConfig.stage] || []
    },
    // 过滤后的指标列表（用于单台发动机时序图）
    filteredMetricsForSingle() {
      const indicators = this.availableIndicatorsForSingle
      if (!this.singleEngineMetricSearchText) {
        return indicators
      }
      const search = this.singleEngineMetricSearchText.toLowerCase()
      return indicators.filter(indicator => 
        indicator.toLowerCase().includes(search)
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
    goHome() {
      this.$router.push('/')
    },
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
    
    // 统一的路径修正函数：将 0STATIC1（字母O）替换为 0STATIC1（数字0）
    correctFilePath(path) {
      if (!path) return path
      // 将路径中的 0STATIC1（字母O）替换为 0STATIC1（数字0）
      // 注意：需要处理多种情况：路径开头、路径中间、Windows路径分隔符
      let corrected = String(path)
      // 替换路径开头的 0STATIC1/
      corrected = corrected.replace(/^0STATIC1\//gi, '0STATIC1/')
      // 替换路径中间的 /0STATIC1/
      corrected = corrected.replace(/\/0STATIC1\//gi, '/0STATIC1/')
      // 替换 Windows 路径分隔符的 \OSTATIC1\
      corrected = corrected.replace(/\\0STATIC1\\/gi, '\\0STATIC1\\')
      // 替换路径开头的 OSTATIC1\（Windows路径）
      corrected = corrected.replace(/^0STATIC1\\/gi, '0STATIC1\\')
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
      // 设置选中的发动机（单选）
      this.singleEngineConfig.selectedEngineId = engine.id
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
    
    selectAllMetricsForSingle() {
      this.singleEngineConfig.selectedMetrics = [...this.availableIndicatorsForSingle]
    },
    
    clearMetricSelectionForSingle() {
      this.singleEngineConfig.selectedMetrics = []
    },
    
    async loadSingleEngineChart() {
      if (!this.singleEngineConfig.stage) {
        alert('请选择阶段')
        return
      }
      if (!this.singleEngineConfig.selectedEngineId) {
        alert('请选择发动机')
        return
      }
      if (this.singleEngineConfig.selectedMetrics.length === 0) {
        alert('请选择至少一个指标')
        return
      }
      
      try {
        const selectedEngine = this.engines.find(e => e.id === this.singleEngineConfig.selectedEngineId)
        
        if (!selectedEngine) {
          alert('未找到选定的发动机')
          return
        }
        
        const metrics = this.singleEngineConfig.selectedMetrics
        const normalize = this.singleEngineConfig.normalize
        const timeStart = this.singleEngineConfig.timeStart
        const timeEnd = this.singleEngineConfig.timeEnd
        
        // 阶段到文件名的映射（根据实际文件结构调整）
        const stageFileMap = {
          '0static': '0STATIC1',
          '1hispeed': '1hispeed',
          '2lowspeed': '2lowspeed',
          '3EOP-RPM': '3EOP-RPM'
        }
        
        const stageFile = stageFileMap[this.singleEngineConfig.stage]
        if (!stageFile) {
          alert('无效的阶段选择')
          return
        }
        
        const series = []
        const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
        
        const dataType = selectedEngine.dataType || 'EOP-Sw'
        
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
            
            if (stageFile.startsWith('0STATIC')) {
              const zeroStatic = '0' + stageFile.substring(1)
              pathOptions.unshift(
                `${zeroStatic}/${dataType}/${stageFile}.csv`
              )
            }
            
            if (pathOptions.length > 0) {
              filename = pathOptions[0]
              filename = this.correctFilePath(filename)
            }
          }
          
          // 获取所有指标的数据
          const response = await getCsvByFile(
            filename,
            metrics,
            10000,
            0
          )
          
          if (response.data && response.data.length > 0) {
            const timeCol = response.columns[0]
            
            // 为每个指标创建一个系列
            for (let i = 0; i < metrics.length; i++) {
              const metric = metrics[i]
              let metricData = response.data.map(row => [
                row[timeCol],
                normalize ? this.normalizeValue(row[metric], metrics) : row[metric]
              ])
              
              // 应用时间范围过滤
              if (timeStart !== null && timeStart !== undefined) {
                metricData = metricData.filter(point => point[0] >= timeStart)
              }
              if (timeEnd !== null && timeEnd !== undefined) {
                metricData = metricData.filter(point => point[0] <= timeEnd)
              }
              
              series.push({
                name: metric,
                type: 'line',
                data: metricData,
                smooth: true,
                lineStyle: {
                  color: colors[i % colors.length]
                }
              })
            }
          }
        } catch (error) {
          console.warn(`获取发动机 ${selectedEngine.engineNumber} 数据失败:`, error)
        }
        
        if (series.length > 0) {
          this.singleEngineChart = {
            title: {
              text: `${selectedEngine.engineNumber} - 多指标时序图`,
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
              name: '时间 (秒)'
            },
            yAxis: {
              type: 'value',
              name: normalize ? '归一化值' : '指标值'
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
      const timeStart = this.singleEngineConfig.timeStart !== null && this.singleEngineConfig.timeStart !== undefined ? this.singleEngineConfig.timeStart : 0
      const timeEnd = this.singleEngineConfig.timeEnd !== null && this.singleEngineConfig.timeEnd !== undefined ? this.singleEngineConfig.timeEnd : 180
      const selectedEngine = this.engines.find(e => e.id === this.singleEngineConfig.selectedEngineId)
      
      const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
      
      const series = metrics.map((metric, index) => {
        const data = []
        for (let t = timeStart; t <= timeEnd; t += 0.5) {
          const value = Math.sin(t / 10 + index) * 20 + 100 + Math.random() * 10
          data.push([t, normalize ? value / 200 : value])
        }
        
        return {
          name: metric,
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
          text: `${selectedEngine ? selectedEngine.engineNumber : '发动机'} - 多指标时序图`,
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
          '0static': '0STATIC1',
          '1hispeed': '1hispeed',
          '2lowspeed': '2lowspeed',
          '3EOP-RPM': '3EOP-RPM'
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
              
              if (stageFile.startsWith('0STATIC')) {
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
              let metricData = response.data.map(row => [
                row[timeCol],
                row[metric]
              ])
              
              // 应用时间范围过滤
              const timeStart = this.multiEngineConfig.timeStart
              const timeEnd = this.multiEngineConfig.timeEnd
              if (timeStart !== null && timeStart !== undefined) {
                metricData = metricData.filter(point => point[0] >= timeStart)
              }
              if (timeEnd !== null && timeEnd !== undefined) {
                metricData = metricData.filter(point => point[0] <= timeEnd)
              }
              
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
      const timeStart = this.multiEngineConfig.timeStart !== null && this.multiEngineConfig.timeStart !== undefined ? this.multiEngineConfig.timeStart : 0
      const timeEnd = this.multiEngineConfig.timeEnd !== null && this.multiEngineConfig.timeEnd !== undefined ? this.multiEngineConfig.timeEnd : 180
      
      const series = selectedEngines.map((engine, index) => {
        const data = []
        for (let t = timeStart; t <= timeEnd; t += 0.5) {
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
    
    exportData() {
      // TODO: 实现数据导出功能
      alert('导出功能开发中...')
    }
  }
}
</script>

<style scoped>
.page-container {
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

.page-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  width: 100%;
  height: 100%;
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  overflow: visible;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  height: 100%;
}

.tabs-header {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
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
  color: rgba(255, 255, 255, 0.7);
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.tab-button.active {
  background: rgba(102, 126, 234, 0.2);
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
  color: rgba(255, 255, 255, 0.9);
}

.panel-actions {
  display: flex;
  gap: 12px;
}

.filter-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  color: rgba(255, 255, 255, 0.8);
}

.filter-input,
.filter-select {
  padding: 10px 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.table-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow-x: auto;
  overflow-y: visible;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.02);
}

.table-row {
  cursor: pointer;
  transition: all 0.2s;
}

.table-row:hover {
  background: rgba(102, 126, 234, 0.15) !important;
}

.table-row:hover td {
  color: rgba(255, 255, 255, 1) !important;
  background: rgba(102, 126, 234, 0.15) !important;
}

.table-row.selected {
  background: rgba(102, 126, 234, 0.25) !important;
}

.table-row.selected td {
  color: rgba(255, 255, 255, 1) !important;
  background: rgba(102, 126, 234, 0.25) !important;
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
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.page-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: rgba(255, 255, 255, 0.9);
}

.page-btn:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.3);
  color: rgba(255, 255, 255, 1);
  border-color: rgba(102, 126, 234, 0.5);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.selection-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  color: rgba(255, 255, 255, 0.8);
}

.selection-input {
  padding: 10px 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
}

.selection-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.selection-input:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.selection-input option {
  background: #1a1f3a;
  color: rgba(255, 255, 255, 0.9);
}

.selection-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  max-height: 120px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
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

.empty-indicators {
  padding: 20px;
  text-align: center;
  color: #6c757d;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  padding: 4px 0;
  transition: color 0.2s ease;
}

.checkbox-label:hover {
  color: rgba(255, 255, 255, 1);
}

.checkbox-label input[type="checkbox"] {
  accent-color: #667eea;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.switch-label input[type="checkbox"] {
  accent-color: #667eea;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.switch-label:hover {
  color: rgba(255, 255, 255, 1);
}

.engine-selector {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 12px;
  max-height: 200px;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
}

.selector-header {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.btn-small {
  padding: 6px 12px;
  background: rgba(102, 126, 234, 0.3);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-small:hover {
  background: rgba(102, 126, 234, 0.5);
  border-color: rgba(102, 126, 234, 0.6);
  transform: translateY(-1px);
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.selector-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.selector-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.selector-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
}

.date-input:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.date-range span {
  color: rgba(255, 255, 255, 0.8);
}

.time-range-item {
  grid-column: 1 / -1;
}

.time-range-controls {
  width: 100%;
}

.time-range-slider-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.time-range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.time-range-sliders {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider-group > label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.time-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.time-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.time-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
}

.time-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.time-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
}

.time-input-small {
  width: 100px;
  padding: 6px 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  align-self: flex-end;
}

.time-input-small::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.time-input-small:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.chart-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 24px;
  min-height: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chart-wrapper {
  width: 100%;
}

.chart-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
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
  color: rgba(255, 255, 255, 0.6);
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
