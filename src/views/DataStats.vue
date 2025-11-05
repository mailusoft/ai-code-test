<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>📈 数据统计模块</h1>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ totalRecords }}</span>
          <span class="stat-label">累计数据量</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ growthRate }}%</span>
          <span class="stat-label">数据增长率</span>
        </div>
      </div>
    </div>

    <div class="page-content">
      <div class="stats-dashboard">
        <!-- 标签页容器 -->
        <div class="visualization-section">
          <!-- 标签页导航 -->
          <div class="tabs-container">
            <div class="tabs-header">
              <button 
                @click="activeTab = 'column'"
                :class="['tab-button', { active: activeTab === 'column' }]"
              >
                <span class="tab-icon">📊</span>
                <span class="tab-text">列数据可视化</span>
              </button>
              <button 
                @click="activeTab = 'row'"
                :class="['tab-button', { active: activeTab === 'row' }]"
              >
                <span class="tab-icon">📈</span>
                <span class="tab-text">行数据可视化</span>
              </button>
            </div>

            <!-- 标签页内容 -->
            <div class="tabs-content">
              <!-- 加载状态 -->
              <div v-if="loading && !error" class="loading-container">
                <div class="loading-spinner"></div>
                <p>正在加载数据...</p>
              </div>

              <!-- 错误提示 -->
              <div v-if="error && !loading" class="error-container">
                <p class="error-message">{{ error }}</p>
                <button @click="loadData" class="btn btn-primary">重试</button>
                <p style="margin-top: 20px; color: #666; font-size: 14px;">
                  提示：即使后端服务未运行，您也可以查看页面结构。数据加载失败不会影响页面显示。
                </p>
              </div>

              <!-- 列数据可视化 -->
              <div v-show="activeTab === 'column'" class="tab-panel">
                <div v-if="!columnChart1 && !columnChart2 && !columnChart3" class="empty-state">
                  <p>没有可用的列数据图表</p>
                  <p class="empty-hint">请检查：</p>
                  <ul>
                    <li>后端服务是否运行在 {{ apiBaseUrl }}</li>
                    <li>数据文件是否存在：0STATIC1/05IgnLF4, 0STATIC1/06PREINJA, 0STATIC1/09inj1Rate</li>
                    <li>浏览器控制台是否有错误信息</li>
                  </ul>
                  <button @click="loadData" class="btn btn-primary">重新加载</button>
                </div>
                <div v-else class="charts-grid">
                  <div class="chart-card" v-if="columnChart1">
                    <h3 class="chart-title">0STATIC1/05IgnLF4</h3>
                    <v-chart class="chart" :option="columnChart1" />
                  </div>
                  <div class="chart-card" v-if="columnChart2">
                    <h3 class="chart-title">0STATIC1/06PREINJA</h3>
                    <v-chart class="chart" :option="columnChart2" />
                  </div>
                  <div class="chart-card" v-if="columnChart3">
                    <h3 class="chart-title">0STATIC1/09inj1Rate</h3>
                    <v-chart class="chart" :option="columnChart3" />
                  </div>
                </div>
              </div>

              <!-- 行数据可视化 -->
              <div v-show="activeTab === 'row'" class="tab-panel">
                <div v-if="!rowChart1 && !rowChart2 && !rowChart3" class="empty-state">
                  <p>没有可用的行数据图表</p>
                  <p class="empty-hint">请检查：</p>
                  <ul>
                    <li>后端服务是否运行在 {{ apiBaseUrl }}</li>
                    <li>数据文件是否存在：0STATIC1/02IgnLF1, 0STATIC1/06PREINJA, 0STATIC1/09inj1Rate</li>
                    <li>浏览器控制台是否有错误信息</li>
                  </ul>
                  <button @click="loadData" class="btn btn-primary">重新加载</button>
                </div>
                <div v-else class="charts-grid">
                  <div class="chart-card" v-if="rowChart1">
                    <h3 class="chart-title">Snapshot: 0STATIC1/02IgnLF1</h3>
                    <v-chart class="chart" :option="rowChart1" />
                  </div>
                  <div class="chart-card" v-if="rowChart2">
                    <h3 class="chart-title">Snapshot: 0STATIC1/06PREINJA</h3>
                    <v-chart class="chart" :option="rowChart2" />
                  </div>
                  <div class="chart-card" v-if="rowChart3">
                    <h3 class="chart-title">Snapshot: 0STATIC1/09inj1Rate</h3>
                    <v-chart class="chart" :option="rowChart3" />
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
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, ScatterChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

export default {
  name: 'DataStats',
  components: {
    VChart
  },
  data() {
    return {
      totalRecords: 15420,
      growthRate: 12.5,
      avgEfficiency: 87.3,
      maintenanceCount: 156,
      activeTab: 'column', // 当前激活的标签页
      loading: false,
      error: null,
      // 使用相对路径，通过Vite代理访问后端，避免CORS问题
      apiBaseUrl: '/api', // 通过Vite代理访问后端
      
      // 列数据可视化 - 折线图
      columnChart1: null,
      columnChart2: null,
      columnChart3: null,
      
      // 行数据可视化 - 散点图
      rowChart1: null,
      rowChart2: null,
      rowChart3: null
    }
  },
  mounted() {
    // 延迟加载数据，避免阻塞页面渲染
    this.$nextTick(() => {
      this.loadData().catch(err => {
        console.error('加载数据时发生错误:', err)
        // 即使加载失败，也显示页面
        this.loading = false
        this.error = err.message || '加载数据失败'
      })
    })
  },
  methods: {
    // 从后端API获取数据
    async loadData() {
      this.loading = true
      this.error = null
      
      try {
        // 先测试后端连接，添加超时处理
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时
        
        try {
          const testResponse = await fetch(`${this.apiBaseUrl}/`, {
            signal: controller.signal
          })
          clearTimeout(timeoutId)
          
          if (!testResponse.ok) {
            throw new Error(`无法连接到后端服务 (${this.apiBaseUrl})，请确保后端服务正在运行`)
          }
          
          console.log('后端服务连接成功')
        } catch (fetchError) {
          clearTimeout(timeoutId)
          if (fetchError.name === 'AbortError') {
            throw new Error(`连接后端服务超时 (${this.apiBaseUrl})，请检查网络或后端服务状态`)
          } else if (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('NetworkError')) {
            // 检查是否是CORS错误
            if (fetchError.message.includes('CORS') || fetchError.message.includes('Access-Control')) {
              throw new Error(`CORS错误：后端服务未配置CORS。请在后端添加CORS中间件以允许 ${window.location.origin} 访问。详情见 CORS_FIX.md`)
            }
            throw new Error(`无法连接到后端服务 (${this.apiBaseUrl})，请确保后端服务正在运行`)
          }
          throw fetchError
        }
        
        // 先获取可用的数据类型和文件结构
        const availableData = await this.loadAvailableDataTypes()
        
        // 并行加载列数据和行数据，但不阻塞
        await Promise.all([
          this.loadColumnData(availableData).catch(err => {
            console.error('加载列数据失败:', err)
            return null // 继续执行，不中断
          }),
          this.loadRowData(availableData).catch(err => {
            console.error('加载行数据失败:', err)
            return null // 继续执行，不中断
          })
        ])
        
        console.log('数据加载完成')
      } catch (error) {
        console.error('加载数据失败:', error)
        this.error = error.message || '加载数据失败，请检查后端服务是否运行在 ' + this.apiBaseUrl
        // 即使出错也显示页面，让用户看到错误信息
      } finally {
        this.loading = false
      }
    },

    // 获取可用的数据类型和文件结构
    async loadAvailableDataTypes() {
      try {
        // 先获取文件树结构
        const treeResponse = await fetch(`${this.apiBaseUrl}/data/tree`)
        if (treeResponse.ok) {
          const fileTree = await treeResponse.json()
          console.log('文件树结构:', fileTree)
          return { fileTree }
        }
      } catch (error) {
        console.warn('获取文件树失败:', error)
      }
      
      // 如果文件树获取失败，尝试获取数据类型
      try {
        const response = await fetch(`${this.apiBaseUrl}/datatypes`)
        if (response.ok) {
          const datatypes = await response.json()
          console.log('可用的数据类型:', datatypes)
          return { datatypes }
        }
      } catch (error) {
        console.warn('获取数据类型失败:', error)
      }
      
      return {}
    },

    // 从文件树中查找文件路径
    findFileInTree(tree, targetNames) {
      if (!tree) return null
      
      const findInNode = (node) => {
        if (!node) return null
        
        // 检查当前节点
        if (node.type === 'file') {
          const name = node.name.toLowerCase()
          for (const target of targetNames) {
            const targetLower = target.toLowerCase()
            // 检查文件名是否包含目标名称（忽略.csv扩展名）
            const nameWithoutExt = name.replace(/\.csv$/, '')
            if (nameWithoutExt.includes(targetLower) || targetLower.includes(nameWithoutExt)) {
              if (node.path) {
                // 移除 'data/' 前缀，返回相对路径
                return node.path.replace(/^data[\/\\]/, '').replace(/\\/g, '/')
              }
            }
          }
        }
        
        // 递归查找子节点
        if (node.children && Array.isArray(node.children)) {
          for (const child of node.children) {
            const result = findInNode(child)
            if (result) return result
          }
        }
        
        return null
      }
      
      // 如果tree本身就是文件节点，直接查找
      if (tree.type === 'file') {
        return findInNode(tree)
      }
      
      // 如果tree有children，在children中查找
      if (tree.children && Array.isArray(tree.children)) {
        for (const child of tree.children) {
          const result = findInNode(child)
          if (result) return result
        }
      }
      
      return null
    },

    // 加载列数据（折线图）
    async loadColumnData(availableData = {}) {
      // 目标文件名（不包含路径）
      const targetFiles = [
        { targetName: '05IgnLF4', chartKey: 'columnChart1', title: '0STATIC1/05IgnLF4' },
        { targetName: '06PREINJA', chartKey: 'columnChart2', title: '0STATIC1/06PREINJA' },
        { targetName: '09inj1Rate', chartKey: 'columnChart3', title: '0STATIC1/09inj1Rate' }
      ]
      
      // 构建文件列表，优先使用从文件树中找到的路径
      const columnFiles = targetFiles.map(file => {
        let filename = null
        
        // 如果从文件树中找到了文件，使用找到的路径
        if (availableData.fileTree) {
          filename = this.findFileInTree(availableData.fileTree, [file.targetName])
        }
        
        // 如果没找到，使用默认路径格式
        if (!filename) {
          filename = `0STATIC1/${file.targetName}`
        }
        
        return {
          filename: filename,
          chartKey: file.chartKey,
          title: file.title,
          targetName: file.targetName
        }
      })
      
      // 添加备用路径（如果文件树查找失败）
      if (!availableData.fileTree) {
        columnFiles.push(
          { filename: '05IgnLF4', chartKey: 'columnChart1', title: '05IgnLF4', targetName: '05IgnLF4' },
          { filename: '06PREINJA', chartKey: 'columnChart2', title: '06PREINJA', targetName: '06PREINJA' },
          { filename: '09inj1Rate', chartKey: 'columnChart3', title: '09inj1Rate', targetName: '09inj1Rate' }
        )
      }

      // 记录已成功加载的图表，避免重复加载
      const loadedCharts = new Set()
      
      for (const file of columnFiles) {
        // 如果该图表已经加载成功，跳过
        if (loadedCharts.has(file.chartKey)) {
          continue
        }
        
        try {
          console.log(`开始加载文件: ${file.filename}`)
          
          const testColumns = ['1_S1G0000840000000']
          
          let firstResponse
          let firstResult
          
          try {
            firstResponse = await fetch(`${this.apiBaseUrl}/csv/by-file`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                filename: file.filename,
                columns: testColumns,
                limit: 1,
                offset: 0
              })
            })

            if (!firstResponse.ok) {
              const errorText = await firstResponse.text()
              console.warn(`获取 ${file.filename} 失败:`, errorText)
              
              // 如果文件不存在，尝试下一个文件
              if (firstResponse.status === 404) {
                console.log(`文件 ${file.filename} 不存在，跳过`)
                continue
              }
              
              // 尝试备用列名
              const altColumns = ['1_S1G0000860000000', 'time']
              
              firstResponse = await fetch(`${this.apiBaseUrl}/csv/by-file`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  filename: file.filename,
                  columns: altColumns,
                  limit: 1,
                  offset: 0
                })
              })
              
              if (!firstResponse.ok) {
                if (firstResponse.status === 404) {
                  console.log(`文件 ${file.filename} 不存在，跳过`)
                  continue
                }
                const errorText2 = await firstResponse.text()
                throw new Error(`获取 ${file.filename} 列名失败: ${firstResponse.status} ${firstResponse.statusText} - ${errorText2}`)
              }
            }
            
            firstResult = await firstResponse.json()
          } catch (fetchError) {
            console.warn(`获取 ${file.filename} 数据时出错:`, fetchError)
            // 文件不存在时继续尝试下一个，不抛出错误
            if (fetchError.message && fetchError.message.includes('404')) {
              continue
            }
            throw fetchError
          }

          const allColumns = firstResult.columns || []
          
          if (allColumns.length === 0) {
            console.warn(`${file.filename} 没有列，返回的columns为空`)
            console.warn('返回的数据:', firstResult)
            continue
          }
          
          console.log(`成功获取 ${file.filename} 的列:`, allColumns)

          // 获取完整数据（传入除第一列外的所有列，第一列是时间，后端会自动加上）
          const response = await fetch(`${this.apiBaseUrl}/csv/by-file`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              filename: file.filename,
              columns: allColumns.slice(1), // 传入除第一列外的所有列（第一列是时间，后端会自动加上）
              limit: 1000, // 获取前1000行数据
              offset: 0
            })
          })

          if (!response.ok) {
            throw new Error(`获取 ${file.filename} 数据失败: ${response.statusText}`)
          }

          const result = await response.json()
          
          if (!result.data || result.data.length === 0) {
            console.warn(`${file.filename} 没有数据`)
            continue
          }

          // 获取列名（第一列是时间，其他列是引擎）
          const columns = result.columns || []
          const timeCol = columns[0] // 第一列是时间
          const engineCols = columns.slice(1) // 其他列是引擎

          // 如果引擎列少于3个，取前3个；如果多于3个，也取前3个
          const selectedEngines = engineCols.slice(0, 3)

          // 转换数据格式为ECharts需要的格式
          const seriesData = selectedEngines.map((engine, index) => {
            const colors = ['#5470c6', '#ff9c6e', '#91cc75'] // 蓝色、橙色、绿色
            const data = result.data.map(row => [row[timeCol], row[engine]])
            
            return {
              name: engine,
              type: 'line',
              data: data,
              smooth: true,
              symbol: 'none',
              lineStyle: {
                color: colors[index % colors.length]
              }
            }
          })

          // 确定时间范围
          const timeValues = result.data.map(row => row[timeCol]).filter(v => v != null)
          const timeMin = Math.min(...timeValues)
          const timeMax = Math.max(...timeValues)

          // 确定值范围
          const allValues = []
          selectedEngines.forEach(engine => {
            result.data.forEach(row => {
              if (row[engine] != null) {
                allValues.push(row[engine])
              }
            })
          })
          const valueMin = Math.min(...allValues)
          const valueMax = Math.max(...allValues)
          const valuePadding = (valueMax - valueMin) * 0.1

          // 创建图表配置
          this[file.chartKey] = {
            title: {
              text: file.title,
              left: 'center',
              textStyle: {
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: selectedEngines,
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
              name: 'Time (seconds)',
              min: timeMin,
              max: timeMax
            },
            yAxis: {
              type: 'value',
              name: 'Value',
              min: valueMin - valuePadding,
              max: valueMax + valuePadding
            },
            series: seriesData
          }
          
          // 标记该图表已成功加载
          loadedCharts.add(file.chartKey)
        } catch (error) {
          console.error(`加载 ${file.filename} 失败:`, error)
          // 显示更详细的错误信息
          if (error.message && error.message.includes('数据目录不存在')) {
            console.error(`⚠️ 后端提示"数据目录不存在"，请检查：`)
            console.error(`  1. 后端项目根目录下是否有 data/ 文件夹`)
            console.error(`  2. 文件路径是否正确: ${file.filename}`)
            console.error(`  3. 实际文件位置可能是: data/${file.filename}/xxx.csv`)
            console.error(`  4. 可以访问 ${this.apiBaseUrl}/data/tree 查看实际文件结构`)
          }
          // 继续处理其他文件，不中断整个流程
        }
      }
    },

    // 加载行数据（散点图 - Snapshot）
    async loadRowData(availableData = {}) {
      // 目标文件名（不包含路径）
      const targetFiles = [
        { targetName: '02IgnLF1', chartKey: 'rowChart1', title: 'Snapshot: 0STATIC1/02IgnLF1 (IgnLf1.csv)' },
        { targetName: '06PREINJA', chartKey: 'rowChart2', title: 'Snapshot: 0STATIC1/06PREINJA (PREINJA1.csv)' },
        { targetName: '09inj1Rate', chartKey: 'rowChart3', title: 'Snapshot: 0STATIC1/09inj1Rate (Ing1Rate1.csv)' }
      ]
      
      // 构建文件列表，优先使用从文件树中找到的路径
      const rowFiles = targetFiles.map(file => {
        let filename = null
        
        // 如果从文件树中找到了文件，使用找到的路径
        if (availableData.fileTree) {
          filename = this.findFileInTree(availableData.fileTree, [file.targetName])
        }
        
        // 如果没找到，使用默认路径格式
        if (!filename) {
          filename = `0STATIC1/${file.targetName}`
        }
        
        return {
          filename: filename,
          chartKey: file.chartKey,
          title: file.title,
          targetName: file.targetName
        }
      })
      
      // 添加备用路径（如果文件树查找失败）
      if (!availableData.fileTree) {
        rowFiles.push(
          { filename: '02IgnLF1', chartKey: 'rowChart1', title: 'Snapshot: 02IgnLF1', targetName: '02IgnLF1' },
          { filename: '06PREINJA', chartKey: 'rowChart2', title: 'Snapshot: 06PREINJA', targetName: '06PREINJA' },
          { filename: '09inj1Rate', chartKey: 'rowChart3', title: 'Snapshot: 09inj1Rate', targetName: '09inj1Rate' }
        )
      }

      // 记录已成功加载的图表
      const loadedCharts = new Set()
      
      for (const file of rowFiles) {
        // 如果该图表已经加载成功，跳过
        if (loadedCharts.has(file.chartKey)) {
          continue
        }
        
        try {
          console.log(`开始加载行数据文件: ${file.filename}`)
          
          const testColumns = ['1_S1G0000840000000']
          
          let firstResponse
          let firstResult
          
          try {
            firstResponse = await fetch(`${this.apiBaseUrl}/csv/by-file`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                filename: file.filename,
                columns: testColumns,
                limit: 1,
                offset: 0
              })
            })

            if (!firstResponse.ok) {
              const errorText = await firstResponse.text()
              console.warn(`获取 ${file.filename} 失败:`, errorText)
              
              if (firstResponse.status === 404) {
                console.log(`文件 ${file.filename} 不存在，跳过`)
                continue
              }
              
              const altColumns = ['1_S1G0000860000000', 'time']
              
              firstResponse = await fetch(`${this.apiBaseUrl}/csv/by-file`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  filename: file.filename,
                  columns: altColumns,
                  limit: 1,
                  offset: 0
                })
              })
              
              if (!firstResponse.ok) {
                if (firstResponse.status === 404) {
                  console.log(`文件 ${file.filename} 不存在，跳过`)
                  continue
                }
                const errorText2 = await firstResponse.text()
                throw new Error(`获取 ${file.filename} 列名失败: ${firstResponse.status} ${firstResponse.statusText} - ${errorText2}`)
              }
            }
            
            firstResult = await firstResponse.json()
          } catch (fetchError) {
            console.warn(`获取 ${file.filename} 数据时出错:`, fetchError)
            if (fetchError.message && fetchError.message.includes('404')) {
              continue
            }
            throw fetchError
          }

          const allColumns = firstResult.columns || []

          if (allColumns.length === 0) {
            console.warn(`${file.filename} 没有列，返回的columns为空`)
            console.warn('返回的数据:', firstResult)
            continue
          }
          
          console.log(`成功获取 ${file.filename} 的列:`, allColumns)

          // 获取第一行的完整数据（Snapshot）
          const response = await fetch(`${this.apiBaseUrl}/csv/by-file`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              filename: file.filename,
              columns: allColumns.slice(1), // 传入除第一列外的所有列（第一列是时间，后端会自动加上）
              limit: 1, // 只获取第一行
              offset: 0
            })
          })

          if (!response.ok) {
            throw new Error(`获取 ${file.filename} 数据失败: ${response.statusText}`)
          }

          const result = await response.json()
          
          if (!result.data || result.data.length === 0) {
            console.warn(`${file.filename} 没有数据`)
            continue
          }

          // 获取第一行数据
          const firstRow = result.data[0]
          const columns = result.columns || []
          const timeCol = columns[0] // 第一列是时间，不需要
          const engineCols = columns.slice(1) // 其他列是引擎

          // 转换数据格式为散点图格式 [索引, 值]
          const scatterData = []
          engineCols.forEach((engine, index) => {
            const value = firstRow[engine]
            if (value != null && !isNaN(value)) {
              scatterData.push([index, value])
            }
          })

          // 确定值范围
          const values = scatterData.map(d => d[1])
          const valueMin = Math.min(...values)
          const valueMax = Math.max(...values)
          const valuePadding = (valueMax - valueMin) * 0.1 || 0.01

          // 创建散点图配置
          this[file.chartKey] = {
            title: {
              text: file.title,
              left: 'center',
              textStyle: {
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: function(params) {
                return `Index: ${params.value[0]}<br/>Value: ${params.value[1].toFixed(3)}`
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
              type: 'value',
              name: 'Machine/Sensor Index (First 100 columns)',
              min: 0,
              max: Math.max(100, scatterData.length)
            },
            yAxis: {
              type: 'value',
              name: 'Value at First Timestep',
              min: valueMin - valuePadding,
              max: valueMax + valuePadding
            },
            series: [
              {
                type: 'scatter',
                data: scatterData,
                symbolSize: 8
              }
            ]
          }
          
          // 标记该图表已成功加载
          loadedCharts.add(file.chartKey)
        } catch (error) {
          console.error(`加载 ${file.filename} 失败:`, error)
          if (error.message && error.message.includes('数据目录不存在')) {
            console.error(`⚠️ 后端提示"数据目录不存在"，请检查：`)
            console.error(`  1. 后端项目根目录下是否有 data/ 文件夹`)
            console.error(`  2. 文件路径是否正确: ${file.filename}`)
            console.error(`  3. 实际文件位置可能是: data/${file.filename}/xxx.csv`)
            console.error(`  4. 可以访问 ${this.apiBaseUrl}/data/tree 查看实际文件结构`)
          }
          // 继续处理其他文件，不中断整个流程
        }
      }
    },

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

.stats-dashboard {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}

.visualization-section {
  background: white;
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;
}

.visualization-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.tabs-container {
  width: 100%;
}

.tabs-header {
  display: flex;
  gap: 8px;
  padding: 20px 30px 0 30px;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  position: relative;
  margin-bottom: -2px;
}

.tab-button:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
  font-weight: 600;
  background: rgba(102, 126, 234, 0.05);
}

.tab-icon {
  font-size: 16px;
}

.tab-text {
  font-weight: 600;
}

.tabs-content {
  padding: 30px;
  min-height: 600px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
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

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 400px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  margin-top: 20px;
  color: #666;
  font-size: 16px;
}

/* 错误状态样式 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 400px;
}

.error-message {
  color: #dc3545;
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 400px;
  text-align: center;
}

.empty-state p {
  color: #666;
  font-size: 16px;
  margin-bottom: 16px;
}

.empty-state .empty-hint {
  color: #999;
  font-size: 14px;
  margin-top: 24px;
  margin-bottom: 12px;
}

.empty-state ul {
  text-align: left;
  color: #666;
  font-size: 14px;
  margin: 16px 0;
  padding-left: 20px;
}

.empty-state li {
  margin-bottom: 8px;
}

.section-title {
  margin: 0 0 32px 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  width: 100%;
}

.chart-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart-title {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.chart {
  width: 100%;
  height: 400px;
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

  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .tabs-header {
    padding: 15px 20px 0 20px;
    flex-wrap: wrap;
  }

  .tab-button {
    padding: 10px 16px;
    font-size: 13px;
  }

  .tabs-content {
    padding: 20px;
    min-height: 400px;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart {
    height: 300px;
  }
}
</style>
