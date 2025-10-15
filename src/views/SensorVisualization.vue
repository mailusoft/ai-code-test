<template>
  <div class="sensor-visualization">
      <div class="visualization-header">
        <div class="header-content">
          <h1>🔬 传感器数据可视化</h1>
          <div class="engine-info">
            <span class="engine-model">{{ engineData.engineModel }}</span>
            <span class="test-date">{{ engineData.testDate }}</span>
            <span class="bench-number">{{ engineData.testBenchNumber }}</span>
          </div>
        </div>
        <div class="header-controls">
          <!-- 告警状态指示器 -->
          <div class="alert-indicator" :class="{ active: hasActiveAlerts }">
            <div class="alert-icon" :class="{ blinking: hasActiveAlerts }">
              🚨
            </div>
            <span class="alert-count">{{ activeAlerts.length }}</span>
          </div>
          <button @click="toggleAlertSettings" class="settings-button">
            ⚙️
          </button>
          <button @click="goBack" class="back-button">
            ← 返回数据展示
          </button>
        </div>
      </div>

    <div class="visualization-content">
      <!-- 传感器选择面板 -->
      <div class="sensor-panel">
        <h3>传感器选择</h3>
        <div class="sensor-grid">
          <div 
            v-for="sensor in sensors" 
            :key="sensor.id"
            @click="selectSensor(sensor)"
            :class="['sensor-card', { active: selectedSensor?.id === sensor.id }]"
          >
            <div class="sensor-icon">{{ sensor.icon }}</div>
            <div class="sensor-info">
              <h4>{{ sensor.name }}</h4>
              <p>{{ sensor.unit }}</p>
              <div class="sensor-status" :class="sensor.status">
                {{ sensor.statusText }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 波形图显示区域 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>{{ selectedSensor?.name || '请选择传感器' }}</h3>
          <div class="chart-controls">
            <button @click="togglePlayPause" class="control-btn">
              {{ isPlaying ? '⏸️' : '▶️' }}
            </button>
            <button @click="resetView" class="control-btn">🔄</button>
            <button @click="exportData" class="control-btn">📊</button>
            <button @click="testAlert" class="control-btn test-btn">🚨 测试告警</button>
          </div>
        </div>

        <!-- 阶段标识条 -->
        <div class="phase-indicator">
          <div 
            v-for="phase in testPhases" 
            :key="phase.id"
            :class="['phase-segment', phase.status]"
            :style="{ width: phase.width + '%' }"
          >
            <span class="phase-label">{{ phase.name }}</span>
            <span class="phase-duration">{{ phase.duration }}s</span>
          </div>
        </div>

        <!-- 波形图 -->
        <div class="waveform-container" ref="waveformContainer">
          <canvas ref="waveformCanvas" class="waveform-canvas"></canvas>
          
          <!-- 异常标注 -->
          <div 
            v-for="anomaly in anomalies" 
            :key="anomaly.id"
            :class="['anomaly-marker', anomaly.severity]"
            :style="{ left: anomaly.position + '%' }"
          >
            <div class="anomaly-tooltip">
              <strong>{{ anomaly.sensor }}</strong><br>
              {{ anomaly.description }}<br>
              <small>时间: {{ anomaly.time }}s</small>
            </div>
          </div>
        </div>

        <!-- 图例 -->
        <div class="legend">
          <div class="legend-item">
            <div class="legend-color startup"></div>
            <span>启动阶段</span>
          </div>
          <div class="legend-item">
            <div class="legend-color steady"></div>
            <span>稳态阶段</span>
          </div>
          <div class="legend-item">
            <div class="legend-color shutdown"></div>
            <span>停机阶段</span>
          </div>
          <div class="legend-item">
            <div class="legend-color warning"></div>
            <span>警告异常</span>
          </div>
          <div class="legend-item">
            <div class="legend-color error"></div>
            <span>严重异常</span>
          </div>
        </div>
      </div>

      <!-- 数据统计面板 -->
      <div class="stats-panel">
        <h3>数据统计</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ currentStats.max }}</div>
            <div class="stat-label">最大值</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ currentStats.min }}</div>
            <div class="stat-label">最小值</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ currentStats.avg }}</div>
            <div class="stat-label">平均值</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ anomalies.length }}</div>
            <div class="stat-label">异常数量</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 告警弹窗 -->
    <div v-if="showAlertModal" class="alert-modal-overlay" @click="closeAlertModal">
      <div class="alert-modal" @click.stop>
        <div class="alert-modal-header">
          <h3>🚨 异常告警</h3>
          <button @click="closeAlertModal" class="close-button">×</button>
        </div>
        <div class="alert-modal-content">
          <div v-for="alert in currentAlerts" :key="alert.id" class="alert-item" :class="alert.severity">
            <div class="alert-icon">{{ alert.icon }}</div>
            <div class="alert-details">
              <h4>{{ alert.sensor }}</h4>
              <p>{{ alert.message }}</p>
              <div class="alert-meta">
                <span class="alert-time">{{ alert.timestamp }}</span>
                <span class="alert-level">{{ alert.level }}</span>
              </div>
            </div>
            <button @click="acknowledgeAlert(alert)" class="acknowledge-btn">
              确认
            </button>
          </div>
        </div>
        <div class="alert-modal-footer">
          <button @click="acknowledgeAllAlerts" class="acknowledge-all-btn">
            确认所有告警
          </button>
          <button @click="viewAlertHistory" class="history-btn">
            查看历史
          </button>
        </div>
      </div>
    </div>

    <!-- 告警设置面板 -->
    <div v-if="showAlertSettings" class="alert-settings-overlay" @click="closeAlertSettings">
      <div class="alert-settings-panel" @click.stop>
        <div class="settings-header">
          <h3>⚙️ 告警设置</h3>
          <button @click="closeAlertSettings" class="close-button">×</button>
        </div>
        <div class="settings-content">
          <div class="setting-group">
            <label>
              <input type="checkbox" v-model="alertSettings.soundEnabled">
              启用声音告警
            </label>
          </div>
          <div class="setting-group">
            <label>
              <input type="checkbox" v-model="alertSettings.popupEnabled">
              启用弹窗告警
            </label>
          </div>
          <div class="setting-group">
            <label>
              <input type="checkbox" v-model="alertSettings.visualEnabled">
              启用视觉告警
            </label>
          </div>
          <div class="setting-group">
            <label>
              告警阈值:
              <input type="range" v-model="alertSettings.threshold" min="1" max="10">
              <span>{{ alertSettings.threshold }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 告警历史面板 -->
    <div v-if="showAlertHistory" class="alert-history-overlay" @click="closeAlertHistory">
      <div class="alert-history-panel" @click.stop>
        <div class="history-header">
          <h3>📋 告警历史</h3>
          <button @click="closeAlertHistory" class="close-button">×</button>
        </div>
        <div class="history-content">
          <div v-for="alert in alertHistory" :key="alert.id" class="history-item" :class="alert.severity">
            <div class="history-icon">{{ alert.icon }}</div>
            <div class="history-details">
              <h4>{{ alert.sensor }}</h4>
              <p>{{ alert.message }}</p>
              <div class="history-meta">
                <span class="history-time">{{ alert.timestamp }}</span>
                <span class="history-status" :class="alert.status">
                  {{ alert.status === 'acknowledged' ? '已确认' : '未确认' }}
                </span>
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
  name: 'SensorVisualization',
  data() {
    return {
      selectedSensor: null,
      isPlaying: false,
      animationId: null,
      currentTime: 0,
      engineData: {
        engineModel: '',
        testDate: '',
        testBenchNumber: ''
      },
      sensors: [
        {
          id: 1,
          name: '温度传感器',
          unit: '°C',
          icon: '🌡️',
          status: 'normal',
          statusText: '正常',
          data: this.generateTemperatureData()
        },
        {
          id: 2,
          name: '压力传感器',
          unit: 'kPa',
          icon: '📊',
          status: 'warning',
          statusText: '警告',
          data: this.generatePressureData()
        },
        {
          id: 3,
          name: '振动传感器',
          unit: 'mm/s',
          icon: '📳',
          status: 'error',
          statusText: '异常',
          data: this.generateVibrationData()
        },
        {
          id: 4,
          name: '转速传感器',
          unit: 'RPM',
          icon: '⚙️',
          status: 'normal',
          statusText: '正常',
          data: this.generateRPMData()
        },
        {
          id: 5,
          name: '流量传感器',
          unit: 'L/min',
          icon: '💧',
          status: 'normal',
          statusText: '正常',
          data: this.generateFlowData()
        },
        {
          id: 6,
          name: '扭矩传感器',
          unit: 'N·m',
          icon: '🔧',
          status: 'warning',
          statusText: '警告',
          data: this.generateTorqueData()
        }
      ],
      testPhases: [
        {
          id: 1,
          name: '启动',
          duration: 30,
          width: 20,
          status: 'startup'
        },
        {
          id: 2,
          name: '稳态',
          duration: 120,
          width: 60,
          status: 'steady'
        },
        {
          id: 3,
          name: '停机',
          duration: 30,
          width: 20,
          status: 'shutdown'
        }
      ],
      anomalies: [
        {
          id: 1,
          sensor: '温度传感器',
          description: '温度超出正常范围',
          time: 45,
          position: 25,
          severity: 'warning'
        },
        {
          id: 2,
          sensor: '振动传感器',
          description: '振动幅度异常',
          time: 78,
          position: 45,
          severity: 'error'
        },
        {
          id: 3,
          sensor: '压力传感器',
          description: '压力波动过大',
          time: 95,
          position: 55,
          severity: 'warning'
        }
      ],
      currentStats: {
        max: 0,
        min: 0,
        avg: 0
      },
      // 告警系统相关数据
      showAlertModal: false,
      showAlertSettings: false,
      showAlertHistory: false,
      activeAlerts: [],
      alertHistory: [],
      alertSettings: {
        soundEnabled: true,
        popupEnabled: true,
        visualEnabled: true,
        threshold: 5
      },
      alertCheckInterval: null
    }
  },
  mounted() {
    // 从路由参数获取发动机数据
    this.engineData = {
      engineModel: this.$route.query.engineModel || 'CFM56-7B',
      testDate: this.$route.query.testDate || '2024-01-15',
      testBenchNumber: this.$route.query.testBenchNumber || 'TB-A001'
    }
    
    // 默认选择第一个传感器
    if (this.sensors.length > 0) {
      this.selectSensor(this.sensors[0])
    }
    this.setupCanvas()
    this.startAnimation()
    this.startAlertMonitoring()
  },
  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    if (this.alertCheckInterval) {
      clearInterval(this.alertCheckInterval)
    }
  },
  computed: {
    hasActiveAlerts() {
      return this.activeAlerts.length > 0
    },
    currentAlerts() {
      return this.activeAlerts.filter(alert => !alert.acknowledged)
    }
  },
  methods: {
    selectSensor(sensor) {
      this.selectedSensor = sensor
      this.updateStats()
      this.drawWaveform()
    },
    
    generateTemperatureData() {
      const data = []
      for (let i = 0; i < 180; i++) {
        let value = 20 + Math.sin(i * 0.1) * 5
        if (i > 30 && i < 50) value += 15 // 启动阶段升温
        if (i > 50 && i < 170) value += 25 + Math.sin(i * 0.05) * 3 // 稳态
        if (i > 170) value -= (i - 170) * 0.5 // 停机降温
        data.push(value)
      }
      return data
    },
    
    generatePressureData() {
      const data = []
      for (let i = 0; i < 180; i++) {
        let value = 100 + Math.sin(i * 0.15) * 10
        if (i > 30 && i < 50) value += 50 // 启动阶段增压
        if (i > 50 && i < 170) value += 80 + Math.sin(i * 0.08) * 5 // 稳态
        if (i > 170) value -= (i - 170) * 2 // 停机减压
        data.push(value)
      }
      return data
    },
    
    generateVibrationData() {
      const data = []
      for (let i = 0; i < 180; i++) {
        let value = 2 + Math.sin(i * 0.2) * 0.5
        if (i > 30 && i < 50) value += 3 // 启动阶段振动
        if (i > 50 && i < 170) value += 1 + Math.sin(i * 0.1) * 0.3 // 稳态
        if (i > 75 && i < 85) value += 8 // 异常振动
        if (i > 170) value -= (i - 170) * 0.1 // 停机
        data.push(value)
      }
      return data
    },
    
    generateRPMData() {
      const data = []
      for (let i = 0; i < 180; i++) {
        let value = 0
        if (i > 30 && i < 50) value = (i - 30) * 50 // 启动加速
        if (i > 50 && i < 170) value = 1000 + Math.sin(i * 0.05) * 20 // 稳态
        if (i > 170) value = Math.max(0, 1000 - (i - 170) * 30) // 停机减速
        data.push(value)
      }
      return data
    },
    
    generateFlowData() {
      const data = []
      for (let i = 0; i < 180; i++) {
        let value = 0
        if (i > 30 && i < 50) value = (i - 30) * 2 // 启动阶段
        if (i > 50 && i < 170) value = 40 + Math.sin(i * 0.1) * 3 // 稳态
        if (i > 170) value = Math.max(0, 40 - (i - 170) * 1.5) // 停机
        data.push(value)
      }
      return data
    },
    
    generateTorqueData() {
      const data = []
      for (let i = 0; i < 180; i++) {
        let value = 0
        if (i > 30 && i < 50) value = (i - 30) * 5 // 启动阶段
        if (i > 50 && i < 170) value = 100 + Math.sin(i * 0.08) * 8 // 稳态
        if (i > 170) value = Math.max(0, 100 - (i - 170) * 3) // 停机
        data.push(value)
      }
      return data
    },
    
    setupCanvas() {
      const canvas = this.$refs.waveformCanvas
      const container = this.$refs.waveformContainer
      
      const resizeCanvas = () => {
        const rect = container.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
        this.drawWaveform()
      }
      
      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)
    },
    
    drawWaveform() {
      if (!this.selectedSensor) return
      
      const canvas = this.$refs.waveformCanvas
      const ctx = canvas.getContext('2d')
      const data = this.selectedSensor.data
      
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 设置样式
      ctx.strokeStyle = '#667eea'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // 绘制网格
      this.drawGrid(ctx, canvas)
      
      // 绘制波形
      ctx.beginPath()
      const stepX = canvas.width / (data.length - 1)
      const minValue = Math.min(...data)
      const maxValue = Math.max(...data)
      const range = maxValue - minValue || 1
      
      data.forEach((value, index) => {
        const x = index * stepX
        const y = canvas.height - ((value - minValue) / range) * (canvas.height - 40) - 20
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
      
      // 绘制数据点
      ctx.fillStyle = '#667eea'
      data.forEach((value, index) => {
        const x = index * stepX
        const y = canvas.height - ((value - minValue) / range) * (canvas.height - 40) - 20
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // 绘制Y轴标签
      this.drawYAxisLabels(ctx, canvas, minValue, maxValue)
      
      // 绘制X轴标签
      this.drawXAxisLabels(ctx, canvas)
    },
    
    drawGrid(ctx, canvas) {
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1
      
      // 水平网格线
      for (let i = 0; i <= 10; i++) {
        const y = (canvas.height - 40) * (i / 10) + 20
        ctx.beginPath()
        ctx.moveTo(60, y)
        ctx.lineTo(canvas.width - 20, y)
        ctx.stroke()
      }
      
      // 垂直网格线
      for (let i = 0; i <= 10; i++) {
        const x = (canvas.width - 80) * (i / 10) + 60
        ctx.beginPath()
        ctx.moveTo(x, 20)
        ctx.lineTo(x, canvas.height - 20)
        ctx.stroke()
      }
    },
    
    drawYAxisLabels(ctx, canvas, minValue, maxValue) {
      ctx.fillStyle = '#666'
      ctx.font = '12px Arial'
      ctx.textAlign = 'right'
      
      for (let i = 0; i <= 10; i++) {
        const y = (canvas.height - 40) * (i / 10) + 20
        const value = maxValue - (maxValue - minValue) * (i / 10)
        ctx.fillText(value.toFixed(1), 55, y + 4)
      }
    },
    
    drawXAxisLabels(ctx, canvas) {
      ctx.fillStyle = '#666'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      
      for (let i = 0; i <= 10; i++) {
        const x = (canvas.width - 80) * (i / 10) + 60
        const time = (180 * i) / 10
        ctx.fillText(time + 's', x, canvas.height - 5)
      }
    },
    
    updateStats() {
      if (!this.selectedSensor) return
      
      const data = this.selectedSensor.data
      this.currentStats = {
        max: Math.max(...data).toFixed(1),
        min: Math.min(...data).toFixed(1),
        avg: (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)
      }
    },
    
    togglePlayPause() {
      this.isPlaying = !this.isPlaying
      if (this.isPlaying) {
        this.startAnimation()
      } else {
        this.stopAnimation()
      }
    },
    
    startAnimation() {
      const animate = () => {
        if (this.isPlaying) {
          this.currentTime += 0.1
          if (this.currentTime >= 180) {
            this.currentTime = 0
          }
          this.drawWaveform()
          this.animationId = requestAnimationFrame(animate)
        }
      }
      animate()
    },
    
    stopAnimation() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
        this.animationId = null
      }
    },
    
    resetView() {
      this.currentTime = 0
      this.drawWaveform()
    },
    
    exportData() {
      if (!this.selectedSensor) return
      
      const data = {
        sensor: this.selectedSensor.name,
        engine: this.engineData.engineModel,
        testDate: this.engineData.testDate,
        data: this.selectedSensor.data,
        anomalies: this.anomalies.filter(a => a.sensor === this.selectedSensor.name)
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${this.selectedSensor.name}_${this.engineData.testDate}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
    
    goBack() {
      this.$router.push('/data-display')
    },
    
    // 告警系统方法
    startAlertMonitoring() {
      // 每1秒检查一次异常，更容易触发
      this.alertCheckInterval = setInterval(() => {
        this.checkForAlerts()
      }, 1000)
    },
    
    checkForAlerts() {
      if (!this.selectedSensor) return
      
      const data = this.selectedSensor.data
      const currentIndex = Math.floor(this.currentTime)
      
      if (currentIndex >= data.length) return
      
      const currentValue = data[currentIndex]
      const sensor = this.selectedSensor
      
      // 根据传感器类型和数值判断异常
      let alert = null
      
      // 降低阈值以便更容易看到告警效果
      if (sensor.name === '温度传感器') {
        if (currentValue > 30) {
          alert = this.createAlert(sensor, 'warning', '温度过高', currentValue)
        } else if (currentValue > 50) {
          alert = this.createAlert(sensor, 'error', '温度严重超标', currentValue)
        }
      } else if (sensor.name === '压力传感器') {
        if (currentValue > 120) {
          alert = this.createAlert(sensor, 'warning', '压力异常', currentValue)
        } else if (currentValue > 180) {
          alert = this.createAlert(sensor, 'error', '压力严重超标', currentValue)
        }
      } else if (sensor.name === '振动传感器') {
        if (currentValue > 3) {
          alert = this.createAlert(sensor, 'warning', '振动异常', currentValue)
        } else if (currentValue > 5) {
          alert = this.createAlert(sensor, 'error', '振动严重超标', currentValue)
        }
      } else if (sensor.name === '转速传感器') {
        if (currentValue > 800) {
          alert = this.createAlert(sensor, 'warning', '转速异常', currentValue)
        } else if (currentValue > 1200) {
          alert = this.createAlert(sensor, 'error', '转速严重超标', currentValue)
        }
      } else if (sensor.name === '流量传感器') {
        if (currentValue > 30) {
          alert = this.createAlert(sensor, 'warning', '流量异常', currentValue)
        } else if (currentValue > 50) {
          alert = this.createAlert(sensor, 'error', '流量严重超标', currentValue)
        }
      } else if (sensor.name === '扭矩传感器') {
        if (currentValue > 80) {
          alert = this.createAlert(sensor, 'warning', '扭矩异常', currentValue)
        } else if (currentValue > 120) {
          alert = this.createAlert(sensor, 'error', '扭矩严重超标', currentValue)
        }
      }
      
      if (alert) {
        this.triggerAlert(alert)
      }
    },
    
    createAlert(sensor, severity, message, value) {
      return {
        id: Date.now() + Math.random(),
        sensor: sensor.name,
        message: `${message} (当前值: ${value.toFixed(1)}${sensor.unit})`,
        severity: severity,
        level: severity === 'error' ? '严重' : '警告',
        icon: severity === 'error' ? '🚨' : '⚠️',
        timestamp: new Date().toLocaleTimeString(),
        value: value,
        acknowledged: false
      }
    },
    
    triggerAlert(alert) {
      // 检查是否已存在相同告警
      const existingAlert = this.activeAlerts.find(a => 
        a.sensor === alert.sensor && 
        a.message === alert.message && 
        !a.acknowledged
      )
      
      if (existingAlert) return
      
      // 添加到活跃告警列表
      this.activeAlerts.push(alert)
      
      // 添加到历史记录
      this.alertHistory.unshift(alert)
      
      // 限制历史记录数量
      if (this.alertHistory.length > 100) {
        this.alertHistory = this.alertHistory.slice(0, 100)
      }
      
      // 触发告警效果
      if (this.alertSettings.popupEnabled) {
        this.showAlertModal = true
      }
      
      if (this.alertSettings.soundEnabled) {
        this.playAlertSound(alert.severity)
      }
      
      if (this.alertSettings.visualEnabled) {
        this.showVisualAlert(alert)
      }
    },
    
    playAlertSound(severity) {
      // 创建音频上下文
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // 根据严重程度设置不同的声音
      if (severity === 'error') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      } else {
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      }
    },
    
    showVisualAlert(alert) {
      // 创建视觉提示元素
      const alertElement = document.createElement('div')
      alertElement.className = `visual-alert ${alert.severity}`
      alertElement.innerHTML = `
        <div class="alert-icon">${alert.icon}</div>
        <div class="alert-text">${alert.sensor}: ${alert.message}</div>
      `
      
      document.body.appendChild(alertElement)
      
      // 3秒后移除
      setTimeout(() => {
        if (alertElement.parentNode) {
          alertElement.parentNode.removeChild(alertElement)
        }
      }, 3000)
    },
    
    acknowledgeAlert(alert) {
      alert.acknowledged = true
      this.activeAlerts = this.activeAlerts.filter(a => a.id !== alert.id)
      
      if (this.activeAlerts.length === 0) {
        this.showAlertModal = false
      }
    },
    
    acknowledgeAllAlerts() {
      this.activeAlerts.forEach(alert => {
        alert.acknowledged = true
      })
      this.activeAlerts = []
      this.showAlertModal = false
    },
    
    toggleAlertSettings() {
      this.showAlertSettings = !this.showAlertSettings
    },
    
    closeAlertSettings() {
      this.showAlertSettings = false
    },
    
    closeAlertModal() {
      this.showAlertModal = false
    },
    
    viewAlertHistory() {
      this.showAlertHistory = true
      this.showAlertModal = false
    },
    
    closeAlertHistory() {
      this.showAlertHistory = false
    },
    
    // 测试告警功能
    testAlert() {
      if (!this.selectedSensor) {
        alert('请先选择一个传感器！')
        return
      }
      
      // 创建测试告警
      const testAlert = this.createAlert(
        this.selectedSensor, 
        'error', 
        '测试告警 - 这是演示用的告警信息', 
        999.9
      )
      
      this.triggerAlert(testAlert)
    }
  }
}
</script>

<style scoped>
.sensor-visualization {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.visualization-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  z-index: 1;
}

.visualization-header::before {
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

.visualization-header h1 {
  margin: 0 0 8px 0;
  color: white;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.engine-info {
  display: flex;
  gap: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.engine-info span {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.back-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.alert-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.alert-indicator.active {
  background: rgba(220, 53, 69, 0.3);
  animation: pulse 2s infinite;
}

.alert-icon {
  font-size: 18px;
  transition: all 0.3s ease;
}

.alert-icon.blinking {
  animation: blink 1s infinite;
}

.alert-count {
  background: rgba(220, 53, 69, 0.8);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
}

.settings-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.settings-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

.visualization-content {
  display: grid;
  grid-template-columns: 300px 1fr 250px;
  flex: 1;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
  min-height: 0;
}

.sensor-panel {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  min-height: 0;
}

.sensor-panel h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 700;
}

.sensor-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sensor-card {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: #f8f9fa;
}

.sensor-card:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.sensor-card.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.sensor-icon {
  font-size: 24px;
  margin-right: 15px;
}

.sensor-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
}

.sensor-info p {
  margin: 0 0 8px 0;
  font-size: 12px;
  opacity: 0.7;
}

.sensor-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.sensor-status.normal {
  background: #d4edda;
  color: #155724;
}

.sensor-status.warning {
  background: #fff3cd;
  color: #856404;
}

.sensor-status.error {
  background: #f8d7da;
  color: #721c24;
}

.chart-container {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 700;
}

.chart-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.test-btn {
  background: #dc3545 !important;
  animation: pulse 2s infinite;
}

.test-btn:hover {
  background: #c82333 !important;
  transform: translateY(-2px) scale(1.05);
}

.phase-indicator {
  display: flex;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.phase-segment {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  color: white;
  font-weight: 600;
  position: relative;
}

.phase-segment.startup {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}

.phase-segment.steady {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
}

.phase-segment.shutdown {
  background: linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%);
}

.phase-label {
  font-size: 14px;
  margin-bottom: 4px;
}

.phase-duration {
  font-size: 12px;
  opacity: 0.9;
}

.waveform-container {
  flex: 1;
  position: relative;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  min-height: 300px;
}

.waveform-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.anomaly-marker {
  position: absolute;
  top: 10px;
  width: 4px;
  height: 20px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.anomaly-marker.warning {
  background: #ffc107;
}

.anomaly-marker.error {
  background: #dc3545;
}

.anomaly-marker:hover {
  transform: scaleY(1.5);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.anomaly-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #2c3e50;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.anomaly-marker:hover .anomaly-tooltip {
  opacity: 1;
}

.legend {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.legend-color.startup {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}

.legend-color.steady {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
}

.legend-color.shutdown {
  background: linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%);
}

.legend-color.warning {
  background: #ffc107;
}

.legend-color.error {
  background: #dc3545;
}

.stats-panel {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  min-height: 0;
}

.stats-panel h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 700;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .visualization-content {
    grid-template-columns: 250px 1fr 200px;
  }
}

/* 告警弹窗样式 */
.alert-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.alert-modal {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.alert-modal-header {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.alert-modal-content {
  padding: 20px 30px;
  max-height: 400px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 15px;
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.alert-item.warning {
  background: #fff3cd;
  border-left-color: #ffc107;
}

.alert-item.error {
  background: #f8d7da;
  border-left-color: #dc3545;
}

.alert-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.alert-item .alert-icon {
  font-size: 24px;
}

.alert-details {
  flex: 1;
}

.alert-details h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.alert-details p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.alert-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
}

.alert-time {
  color: #999;
}

.alert-level {
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.alert-item.warning .alert-level {
  background: #ffc107;
  color: #856404;
}

.alert-item.error .alert-level {
  background: #dc3545;
  color: white;
}

.acknowledge-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.acknowledge-btn:hover {
  background: #218838;
  transform: translateY(-2px);
}

.alert-modal-footer {
  padding: 20px 30px;
  background: #f8f9fa;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.acknowledge-all-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.acknowledge-all-btn:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.history-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.history-btn:hover {
  background: #545b62;
  transform: translateY(-2px);
}

/* 告警设置面板样式 */
.alert-settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.alert-settings-panel {
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
  animation: slideIn 0.3s ease;
}

.settings-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px 15px 0 0;
}

.settings-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.settings-content {
  padding: 20px;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #2c3e50;
}

.setting-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
}

.setting-group input[type="range"] {
  width: 200px;
  margin: 0 10px;
  accent-color: #667eea;
}

/* 告警历史面板样式 */
.alert-history-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.alert-history-panel {
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

.history-header {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.history-content {
  padding: 20px 30px;
  max-height: 500px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  border-left: 3px solid;
  transition: all 0.3s ease;
}

.history-item.warning {
  background: #fff3cd;
  border-left-color: #ffc107;
}

.history-item.error {
  background: #f8d7da;
  border-left-color: #dc3545;
}

.history-item:hover {
  transform: translateX(3px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-icon {
  font-size: 20px;
}

.history-details h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.history-details p {
  margin: 0 0 6px 0;
  color: #666;
  font-size: 12px;
}

.history-meta {
  display: flex;
  gap: 10px;
  font-size: 11px;
}

.history-time {
  color: #999;
}

.history-status {
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
}

.history-status.acknowledged {
  background: #d4edda;
  color: #155724;
}

.history-status.pending {
  background: #f8d7da;
  color: #721c24;
}

/* 视觉告警提示样式 */
.visual-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 3000;
  animation: slideInRight 0.3s ease;
  border-left: 4px solid;
  max-width: 300px;
}

.visual-alert.warning {
  border-left-color: #ffc107;
}

.visual-alert.error {
  border-left-color: #dc3545;
}

.visual-alert .alert-icon {
  font-size: 20px;
}

.visual-alert .alert-text {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .visualization-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    padding: 15px;
    gap: 15px;
  }
  
  .visualization-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 15px 20px;
  }
  
  .header-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .engine-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .waveform-container {
    min-height: 250px;
  }
  
  .alert-modal {
    width: 95%;
    margin: 20px;
  }
  
  .alert-modal-content {
    padding: 15px 20px;
  }
  
  .alert-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .visual-alert {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
