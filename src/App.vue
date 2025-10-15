<template>
  <div id="app">
    <Sidebar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Sidebar
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  background: #f8f9fa;
  overflow-y: auto;
  min-height: 100vh;
}

/* 全屏页面样式 */
.main-content.fullscreen {
  margin-left: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    margin-left: 240px;
  }
}

@media (max-width: 480px) {
  .main-content {
    margin-left: 0;
  }
}
</style>
