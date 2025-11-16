<template>
  <div class="app-container">
    <!-- 按钮 -->
    <div class="back-home-btn" @click="goHome" title="返回首页">
      <span class="back-icon">←</span>
      <span class="back-text">返回首页</span>
    </div>
    <!-- 主页面内容 -->
    <div class="big-screen-container">
    <!-- 顶部标题栏 + 时间筛选器 -->
    <div class="screen-header">
      <h1 style="text-align: center;">发动机历史数据统计大屏</h1>
      <div class="time-filter">
        <el-select 
          v-model="selectedTimeRange" 
          placeholder="选择时间范围" 
          @change="handleTimeChange"
        >
          <el-option label="最近100台" value="100"></el-option>
          <el-option label="最近一个月" value="month"></el-option>
          <el-option label="最近三个月" value="3month"></el-option>
        </el-select>
      </div>
    </div>

    <!-- 中间内容区（左栏目+主视图+右栏目） -->
    <div class="screen-middle">
      <!-- 左侧栏目
      @click="handleClick('/data-stats')"
      @click.stop="handleClick('/data-stats')"
      @click="handleClick('/engine-filter')"
      @click.stop="handleClick('/engine-filter')"
      -->
      <div class="side-column left-column">
        <div class="chart-card" style="cursor: pointer">
          <div class="chart-title">合格率月趋势</div>
          <div ref="leftChart1" class="chart-container"></div>
        </div>
        <div class="chart-card" style="cursor: pointer">
          <div class="chart-title">不合格指标分布</div>
          <div ref="leftChart2" class="chart-container"></div>
        </div>
      </div>
      
      <!-- 中间主视图 
       @click="handleClick('/data-display')"
       @click.stop="handleClick('/data-display')"
      -->
      <div class="middle-main">
        <div class="chart-card" style="cursor: pointer">
          <div class="chart-title">核心数据概览</div>
          <div ref="middleChart" class="chart-container"></div>
        </div>
      </div>
      <!-- 右侧栏目 
      @click="handleClick('/data-stats')"
      @click.stop="handleClick('/data-stats')"
      @click="handleClick('/model-related')" 
      @click.stop="handleClick('/model-related')"
      -->
      <div class="side-column right-column">
        <div class="chart-card" style="cursor: pointer">
          <div class="chart-title">分阶段合格率</div>
          <div ref="rightChart1" class="chart-container"></div>
        </div>
        <div class="chart-card" style="cursor: pointer">
          <div class="chart-title">机型分布</div>
          <div ref="rightChart2" class="chart-container"></div>
        </div>
      </div>
    </div>

    <!-- 底部图表区 
    @click="handleClick('/data-display')"
    @click.stop="handleClick('/data-display')"
    @click="handleClick('/data-management')"
    @click.stop="handleClick('/data-management')"
    @click="handleClick('/sensor-visualization/1')"
     @click.stop="handleClick('/sensor-visualization/1')"
    -->
    <div class="screen-footer">
      <div class="chart-card" style="cursor: pointer">
          <div class="chart-title">各阶段耗时统计</div>
          <div ref="bottomChart1" class="chart-container"></div>
        </div>
      <div class="chart-card" style="cursor: pointer">
        <div class="chart-title">合格/不合格数量对比</div>
        <div ref="bottomChart2" class="chart-container"></div>
      </div>
      <div class="chart-card" style="cursor: pointer">
          <div class="chart-title">指标相关性分析</div>
          <div ref="bottomChart3" class="chart-container"></div>
        </div>
    </div>

    <!-- 页脚区域 -->
    <div class="screen-page-footer">
      <p>©发动机数据统计系统 | 技术支持：xxx-xxxxxxx</p>
    </div>
    </div> <!-- 闭合big-screen-container -->
    
    <!-- 路由视图容器 - 使用高层级覆盖主页面，默认隐藏 -->
    <div class="router-view-container" v-if="$route.path !== '/'">
      <!-- 返回按钮 -->
      <!-- <div class="back-button-container">
        <button class="back-button" @click="handleBack">
          ← 返回主页面
        </button>
      </div> -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>
  
<style scoped>
:global(:root) {
  --chart-font-size: 1vw;
  --chart-title-size: 1.2vw;
  --chart-symbol-size: 0.5vw;
  --chart-line-width: 0.2vw;
  --chart-bar-width: 3vw;
  --primary-color: #4895ef;
  --secondary-color: #f9c74f;
  --accent-color: #7209b7;
  --success-color: #34a853;
  --warning-color: #f8961e;
  --purple-color: #a855f7;
  --text-color: #ffffff; /* 默认白色文字 */
  --secondary-text-color: #cccccc; /* 次要文字颜色 */
}

/* 响应式调整变量值 */
@media screen and (max-aspect-ratio: 1) {
  :global(:root) {
    --chart-font-size: 2vw;
    --chart-title-size: 2.2vw;
    --chart-symbol-size: 1vw;
    --chart-line-width: 0.4vw;
    --chart-bar-width: 5vw;
  }
}

/* 全局样式重置 */
:global(*) {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 全局body设置，防止出现滚动条 */
:global(body), :global(html) {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 应用容器 */
  .app-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  
  /* 路由视图容器 - 高层级覆盖主页面，确保完全显示 */
  .router-view-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999; /* 更高的层级，确保完全覆盖 */
    background-color: #fff;
    overflow: auto;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  
  /* 淡入淡出动画 */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  
  /* 子页面通用样式 - 确保自适应布局和全屏显示 */
  :deep(.router-view-container > *) {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    display: flex;
    overflow: hidden;
  }
  
  /* 为子页面提供顶部空间，避免内容紧贴边缘 */
  :deep(.router-view-container > * > *) {
    padding: 20px;
    flex: 1;
    overflow: auto;
  }
  
  /* 路由视图通过v-if控制显示/隐藏，无需额外CSS规则 */

/* 容器全屏 */
.big-screen-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  gap: 1%;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}
/*按钮*/
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

/* 顶部标题+筛选器 */
.screen-header {
  height: 10%;
  padding: 0.5% 1%;
  background-color: var(--card-bg-color);
  border-radius: 0.5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: relative; /* 新增 */
}

.screen-header h1 {
  font-size: clamp(1.5rem, 2vw, 2.5rem);
  color: var(--secondary-text-color); /* 修改标题颜色 */
}

.time-filter {
  width: 15%;
  min-width: 180px;
   position: absolute; /* 新增 */
  right: 1%; /* 新增 */
}

/* 中间内容区 */
.screen-middle {
  height: 60%;
  display: flex;
  gap: 1%;
}

/* 左右侧栏目 */
.side-column {
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: 1%;
  height: 100%;
}

/* 中间主视图 */
.middle-main {
  width: 48%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.middle-main .chart-card {
  width: 100%;
  height: 100%;
}

/* 底部图表区 */
.screen-footer {
  height: 25%;
  display: flex;
  gap: 1%;
}

.screen-footer .chart-card {
  width: 32.66%;
  height: 100%;
}

/* 底部页脚样式 */
.screen-page-footer {
  height: 4%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--card-bg-color);
  border-radius: 0.5vw;
  padding: 0.5%;
  font-size: clamp(0.8rem, 1vw, 1rem);
  color: #666;
}

/* 图表卡片通用样式 */
.chart-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5vw;
  padding: 1%;
  display: flex;
  flex-direction: column;
  gap: 1%;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.chart-card:hover {
  box-shadow: 0 0 15px rgba(0, 102, 204, 0.5);
  transform: translateY(-2px);
}

/* 左右侧图表卡片 */
.side-column .chart-card {
  flex: 1;
}

/* 图表标题 */
.chart-title {
  font-size: clamp(1rem, 1.2vw, 1.5rem);
  font-weight: 500;
  color: var(--text-color);
  border-bottom: 1px solid #0066cc;
  padding-bottom: 0.5%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.chart-title::before {
  content: '';
  display: inline-block;
  width: 0.5vw;
  height: 0.5vw;
  border-radius: 50%;
  background-color: var(--primary-color);
  margin-right: 0.5vw;
}

/* 图表容器 */
.chart-container {
  flex: 1;
  background-color: #1a1e35;
  border-radius: 0.3vw;
  padding: 1%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* 响应式适配 */
@media screen and (max-aspect-ratio: 1) {
  .big-screen-container {
    position: relative;
    height: auto;
    min-height: 100vh;
  }
  
  .long-text {
    overflow-wrap: break-word; /* 强制长单词换行 */
    word-break: break-all; /* 中文/英文均换行 */
  }

  /* 表格/图表容器：允许横向滚动（避免内容压缩变形） */
  .chart-container, .table-container {
    width: 100%;
    overflow-x: auto; /* 横向溢出时显示滚动条 */
    -webkit-overflow-scrolling: touch; /* 移动端滚动更流畅 */
  }
  
  /* 图片/视频自适应容器，避免拉伸 */
  .responsive-media {
    max-width: 100%;
    height: auto;
    object-fit: contain; /* 保持比例，不裁剪 */
  }

  .screen-middle, .screen-footer {
    flex-direction: column;
    gap: 1rem;
  }
  
  .side-column, .middle-main, .screen-footer .chart-card {
    width: 100vw;
    height: auto;
  }
  
  .screen-middle, .screen-footer {
    height: auto;
  }
  
  .chart-card {
    margin-bottom: 0;
  }
}
</style>

<script>

import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import { 
  TitleComponent, 
  TooltipComponent, 
  GridComponent, 
  LegendComponent,
  DataZoomComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { ElSelect, ElOption } from 'element-plus';
import 'element-plus/dist/index.css';

export default {
  name: 'ModelRelated',
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()

function handleClick (path) {
  console.log('点击了卡片，准备跳转到：', path)
  // 使用router.push在当前页面内跳转，通过高层级路由视图覆盖显示
  router.push(path)
}


// 注册ECharts组件
echarts.use([
  BarChart, LineChart, PieChart, ScatterChart,
  TitleComponent, TooltipComponent, GridComponent, LegendComponent,
  DataZoomComponent, CanvasRenderer
]);

// 图表引用
const leftChart1 = ref(null);
const leftChart2 = ref(null);
const middleChart = ref(null);
const rightChart1 = ref(null);
const rightChart2 = ref(null);
const bottomChart1 = ref(null);
const bottomChart2 = ref(null);
const bottomChart3 = ref(null);

// 时间筛选相关
const selectedTimeRange = ref('100');
const chartInstances = ref({});

// 模拟数据
const fetchData = (timeRange) => {
  // 生成更真实的随机数据
  const generateRandomData = (base, range, count) => {
    return Array(count).fill(0).map(() => 
      Math.floor(base - range/2 + Math.random() * range)
    );
  };
  
  switch(timeRange) {
    case '100':
      return {
        passRateTrend: { 
          months: ['1月', '2月', '3月', '4月', '5月'], 
          rates: generateRandomData(90, 10, 5) 
        },
        unqualifiedDist: { 
          indicators: ['指标A', '指标B', '指标C', '指标D'], 
          values: generateRandomData(25, 10, 4) 
        },
        stagePassRate: { 
          stages: ['装配', '检测', '调试', '验收'], 
          rates: generateRandomData(90, 8, 4) 
        },
        modelDist: { 
          models: ['机型X', '机型Y', '机型Z'], 
          values: [40, 35, 25] 
        },
        coreOverview: { 
          labels: ['总检测数', '合格数', '不合格数', '平均耗时(分钟)'], 
          values: [100, 92, 8, 22] 
        },
        stageTime: { 
          stages: ['装配', '检测', '调试', '验收'], 
          times: generateRandomData(12, 6, 4) 
        },
        passUnpass: { 
          labels: ['合格', '不合格'], 
          values: [92, 8] 
        },
        correlation: Array(50).fill(0).map(() => 
          [Math.random() * 100, Math.random() * 100]
        )
      };
    case 'month':
      return {
        passRateTrend: { 
          months: ['第1周', '第2周', '第3周', '第4周'], 
          rates: generateRandomData(90, 5, 4) 
        },
        unqualifiedDist: { 
          indicators: ['指标A', '指标B', '指标C', '指标D'], 
          values: generateRandomData(25, 10, 4) 
        },
        stagePassRate: { 
          stages: ['装配', '检测', '调试', '验收'], 
          rates: generateRandomData(92, 6, 4) 
        },
        modelDist: { 
          models: ['机型X', '机型Y', '机型Z'], 
          values: [35, 40, 25] 
        },
        coreOverview: { 
          labels: ['总检测数', '合格数', '不合格数', '平均耗时(分钟)'], 
          values: [280, 258, 22, 20] 
        },
        stageTime: { 
          stages: ['装配', '检测', '调试', '验收'], 
          times: generateRandomData(11, 5, 4) 
        },
        passUnpass: { 
          labels: ['合格', '不合格'], 
          values: [258, 22] 
        },
        correlation: Array(80).fill(0).map(() => 
          [Math.random() * 100, Math.random() * 100]
        )
      };
    case '3month':
      return {
        passRateTrend: { 
          months: ['3月', '4月', '5月'], 
          rates: generateRandomData(90, 7, 3) 
        },
        unqualifiedDist: { 
          indicators: ['指标A', '指标B', '指标C', '指标D'], 
          values: generateRandomData(25, 8, 4) 
        },
        stagePassRate: { 
          stages: ['装配', '检测', '调试', '验收'], 
          rates: generateRandomData(90, 7, 4) 
        },
        modelDist: { 
          models: ['机型X', '机型Y', '机型Z'], 
          values: [38, 32, 30] 
        },
        coreOverview: { 
          labels: ['总检测数', '合格数', '不合格数', '平均耗时(分钟)'], 
          values: [750, 690, 60, 21] 
        },
        stageTime: { 
          stages: ['装配', '检测', '调试', '验收'], 
          times: generateRandomData(12, 6, 4) 
        },
        passUnpass: { 
          labels: ['合格', '不合格'], 
          values: [690, 60] 
        },
        correlation: Array(100).fill(0).map(() => 
          [Math.random() * 100, Math.random() * 100]
        )
      };
  }
};

// 图表初始化通用函数
// 初始化图表时添加resize监听
const initChart = (el, option) => {
  
  if (!el) return null;
  
  // 销毁已有实例避免内存泄漏
  if (echarts.getInstanceByDom(el)) {
    echarts.dispose(el);
  }
  
  const chart = echarts.init(el);
  chart.setOption({
    backgroundColor: '#1a1e35',
    textStyle: { color: '#fff' },
    ...option
  });
  
  // 监听窗口resize，自动适配
  const handleResize = () => {
    chart.resize(); // 关键方法：重绘图表以适应新尺寸
  };
  
  window.addEventListener('resize', handleResize);
  
  // 组件卸载时清理事件监听
  const cleanup = () => {
    window.removeEventListener('resize', handleResize);
  };
  
  return { chart, cleanup };
};
// 初始化所有图表
const renderAllCharts = (data) => {
  // 清理之前的图表实例
  Object.values(chartInstances.value).forEach(instance => {
    if (instance && instance.cleanup) {
      instance.cleanup();
    }
  });

  // 左侧1：合格率月趋势（折线图）
  chartInstances.value.left1 = initChart(leftChart1.value, {
    tooltip: { trigger: 'axis' },
    grid: { left: '5%', right: '5%', bottom: '10%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: data.passRateTrend.months, 
      axisLabel: { color: '#fff' },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
    },
    yAxis: { 
      type: 'value', 
      max: 100, 
      axisLabel: { color: '#fff' }, 
      nameTextStyle: { color: '#fff' },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    series: [{
      name: '合格率(%)',
      type: 'line',
      data: data.passRateTrend.rates,
      itemStyle: { color: 'var(--primary-color)' },
      lineStyle: { width: 3 },
      symbol: 'circle',
      symbolSize: 6,
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(72, 149, 239, 0.3)'
          }, {
            offset: 1, color: 'rgba(72, 149, 239, 0)'
          }]
        }
      }
    }]
  });

  // 左侧2：不合格指标分布（饼图）
  chartInstances.value.left2 = initChart(leftChart2.value, {
    tooltip: { trigger: 'item' },
    legend: { 
      orient: 'vertical', 
      left: 'left', 
      textStyle: { color: '#fff' },
      top: 'middle'
    },
    series: [{
      name: '不合格数量',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['65%', '50%'],
      data: data.unqualifiedDist.indicators.map((item, idx) => ({ 
        name: item, 
        value: data.unqualifiedDist.values[idx] 
      })),
      label: { color: '#fff' },
      itemStyle: {
        borderColor: '#0055aa',
        borderWidth: 2
      },
      emphasis: {
        scale: true,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      }
    }]
  });

  // 中间：核心数据概览（柱状图）
  chartInstances.value.middle = initChart(middleChart.value, {
    tooltip: { trigger: 'axis' },
    grid: { left: '10%', right: '10%', bottom: '15%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: data.coreOverview.labels, 
      axisLabel: { 
        color: '#fff',
        rotate: 15
      },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
    },
    yAxis: { 
      type: 'value', 
      axisLabel: { color: '#fff' },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    series: [{
      type: 'bar',
      data: data.coreOverview.values,
      itemStyle: { 
        color: 'var(--secondary-color)',
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: 40,
      emphasis: {
        itemStyle: {
          color: '#ffd666'
        }
      }
    }]
  });

  // 右侧1：分阶段合格率（柱状图）
  chartInstances.value.right1 = initChart(rightChart1.value, {
    tooltip: { trigger: 'axis' },
    grid: { left: '5%', right: '5%', bottom: '10%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: data.stagePassRate.stages, 
      axisLabel: { color: '#fff' },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
    },
    yAxis: { 
      type: 'value', 
      max: 100, 
      axisLabel: { color: '#fff' },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    series: [{
      name: '合格率(%)',
      type: 'bar',
      data: data.stagePassRate.rates,
      itemStyle: { 
        color: 'var(--accent-color)',
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: {
        itemStyle: {
          color: '#8a2be2'
        }
      }
    }]
  });

  // 右侧2：机型分布（饼图）
  chartInstances.value.right2 = initChart(rightChart2.value, {
    tooltip: { trigger: 'item' },
    legend: { 
      orient: 'vertical', 
      left: 'left', 
      textStyle: { color: '#fff' },
      top: 'middle'
    },
    series: [{
      name: '机型占比',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['65%', '50%'],
      data: data.modelDist.models.map((item, idx) => ({ 
        name: item, 
        value: data.modelDist.values[idx] 
      })),
      label: { color: '#fff' },
      itemStyle: {
        borderColor: '#0055aa',
        borderWidth: 2
      },
      emphasis: {
        scale: true,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      }
    }]
  });

  // 底部1：各阶段耗时统计（折线图）
  chartInstances.value.bottom1 = initChart(bottomChart1.value, {
    tooltip: { trigger: 'axis' },
    grid: { left: '5%', right: '5%', bottom: '10%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: data.stageTime.stages, 
      axisLabel: { color: '#fff', interval: 0 },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
    },
    yAxis: { 
      type: 'value', 
      axisLabel: { color: '#fff' }, 
      name: '耗时(分钟)', 
      nameTextStyle: { color: '#fff' },
      min: 0,
      max: Math.max(...data.stageTime.times) * 1.2,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    series: [{
      name: '耗时',
      type: 'line',
      data: data.stageTime.times,
      itemStyle: { color: 'var(--success-color)' },
      lineStyle: { width: 3 },
      symbol: 'circle',
      symbolSize: 6,
      smooth: true
    }]
  });

  // 底部2：合格/不合格数量对比（柱状图）
  chartInstances.value.bottom2 = initChart(bottomChart2.value, {
    tooltip: { trigger: 'axis' },
    grid: { left: '5%', right: '5%', bottom: '10%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: data.passUnpass.labels, 
      axisLabel: { color: '#fff' },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
    },
    yAxis: { 
      type: 'value', 
      axisLabel: { color: '#fff' }, 
      min: 0, 
      max: Math.max(...data.passUnpass.values) * 1.2,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    series: [{
      type: 'bar',
      data: data.passUnpass.values,
      itemStyle: { 
        color: function(params) {
          return params.dataIndex === 0 ? '#38b000' : '#e63946';
        },
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: 60,
      emphasis: {
        itemStyle: {
          color: function(params) {
            return params.dataIndex === 0 ? '#70e000' : '#ff6b77';
          }
        }
      }
    }]
  });

  // 底部3：指标相关性分析（散点图）
  chartInstances.value.bottom3 = initChart(bottomChart3.value, {
    tooltip: { trigger: 'item' },
    grid: { left: '8%', right: '5%', bottom: '10%', containLabel: true },
    xAxis: { 
      type: 'value', 
      name: '指标A', 
      nameTextStyle: { color: '#fff' }, 
      axisLabel: { color: '#fff' }, 
      min: 0, 
      max: 100,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    yAxis: { 
      type: 'value', 
      name: '指标B', 
      nameTextStyle: { color: '#fff' }, 
      axisLabel: { color: '#fff' }, 
      min: 0, 
      max: 100,
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    series: [{
      type: 'scatter',
      data: data.correlation,
      itemStyle: { 
        color: 'var(--purple-color)', 
        opacity: 0.6 
      },
      symbolSize: 8,
      emphasis: {
        itemStyle: {
          opacity: 1,
          shadowBlur: 10
        },
        symbolSize: 12
      }
    }]
  });
};

// 时间筛选变化时刷新图表
const handleTimeChange = () => {
  const newData = fetchData(selectedTimeRange.value);
  renderAllCharts(newData);
};

// 监听窗口大小变化，优化图表显示
watch(() => window.innerWidth, () => {
  Object.values(chartInstances.value).forEach(instance => {
    if (instance && instance.chart) {
      instance.chart.resize();
    }
  });
});

// 组件挂载时初始化图表
onMounted(() => {
  const initialData = fetchData(selectedTimeRange.value);
  renderAllCharts(initialData);
  
  // 初始触发一次resize确保图表正确显示
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 100);
});
</script>