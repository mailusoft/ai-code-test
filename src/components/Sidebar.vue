<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>
        AI 智能冷试数据分析与异常预警系统</h2>
    </div>
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link
            to="/data-display"
            class="nav-button"
          >
            <span class="nav-icon">📊</span>
            <span class="nav-text">数据展示模块</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/engine-filter"
            class="nav-button"
          >
            <span class="nav-icon">🔍</span>
            <span class="nav-text">发动机筛选模块</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/data-stats"
            class="nav-button"
          >
            <span class="nav-icon">📈</span>
            <span class="nav-text">数据统计模块</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/model-related"
            class="nav-button"
          >
            <span class="nav-icon">🔧</span>
            <span class="nav-text">模型相关模块</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/data-management"
            class="nav-button"
          >
            <span class="nav-icon">📋</span>
            <span class="nav-text">数据管理模块</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
  text-align: center;
}

.sidebar-nav {
  padding: 16px 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 2px;
}

.nav-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 20px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  border-left: 3px solid transparent;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-left-color: rgba(255, 255, 255, 0.3);
}

.nav-button.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-left-color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.nav-icon {
  margin-right: 12px;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.nav-text {
  flex: 1;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 240px;
  }

  .nav-button {
    padding: 14px 16px;
    font-size: 13px;
  }
}
</style>
