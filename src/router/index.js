import { createRouter, createWebHistory } from 'vue-router'
import homepage from '@/homepage.vue'
import DataDisplay from '@/views/DataDisplay.vue'
import EngineFilter from '@/views/EngineFilter.vue'
import DataStats from '@/views/DataStats.vue'
import ModelRelated from '@/views/ModelRelated.vue'
import DataManagement from '@/views/DataManagement.vue'
import SensorVisualization from '@/views/SensorVisualization.vue'
//import { Component } from 'react'

const routes = [
  {
    path: '/',
    name: 'home',
    component: homepage,
    meta: {
      title: '首页',
      icon: '🏠'
    }
  },
  {
    path: '/data-display',
    name: 'DataDisplay',
    component: DataDisplay,
    meta: {
      title: '数据展示模块',
      icon: '📊'
    }
  },
  {
    path: '/engine-filter',
    name: 'EngineFilter',
    component: EngineFilter,
    meta: {
      title: '发动机筛选模块',
      icon: '🔍'
    }
  },
  {
    path: '/data-stats',
    name: 'DataStats',
    component: DataStats,
    meta: {
      title: '数据统计模块',
      icon: '📈'
    }
  },
  {
    path: '/model-related',
    name: 'ModelRelated',
    component: ModelRelated,
    meta: {
      title: '模型相关模块',
      icon: '🔧'
    }
  },
  {
    path: '/data-management',
    name: 'DataManagement',
    component: DataManagement,
    meta: {
      title: '数据管理模块',
      icon: '📋'
    }
  },
  {
    path: '/sensor-visualization/:id',
    name: 'SensorVisualization',
    component: SensorVisualization,
    props: true,
    meta: {
      title: '传感器数据可视化',
      icon: '🔬'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
