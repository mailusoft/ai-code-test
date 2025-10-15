<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <h1>📊 数据展示模块——单台发动机详情</h1>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ tableData.length }}</span>
          <span class="stat-label">测试记录</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">5</span>
          <span class="stat-label">发动机型号</span>
        </div>
      </div>
    </div>

    <div class="page-content">
      <div class="data-table-container">
        <div class="table-header">
          <!-- <h2>发动机测试数据</h2> -->
          <p class="table-subtitle">基本信息</p>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>流水号</th>
                <th>发动机型号</th>
                <th>测试日期</th>
                <th>台架编号</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData" :key="item.id">
                <td>{{ item.serialNumber }}</td>
                <td>{{ item.engineModel }}</td>
                <td>{{ item.testDate }}</td>
                <td>{{ item.testBenchNumber }}</td>
                <td>
      <button
                    @click="visualizeData(item)"
                    class="btn-visualize"
                  >
                    可视化
      </button>
                </td>
              </tr>
            </tbody>
          </table>
      </div>

        <div v-if="tableData.length === 0" class="empty-state">
          <h3>暂无测试数据</h3>
          <p>目前没有发动机测试数据记录。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataDisplay',
  data() {
    return {
      tableData: [
        {
          id: 1,
          serialNumber: 'SP2024001',
          engineModel: 'CFM56-7B',
          testDate: '2024-01-15',
          testBenchNumber: 'TB-A001'
        },
        {
          id: 2,
          serialNumber: 'SP2024002',
          engineModel: 'GE90-115B',
          testDate: '2024-01-18',
          testBenchNumber: 'TB-A002'
        },
        {
          id: 3,
          serialNumber: 'SP2024003',
          engineModel: 'Trent 900',
          testDate: '2024-01-20',
          testBenchNumber: 'TB-B001'
        },
        {
          id: 4,
          serialNumber: 'SP2024004',
          engineModel: 'CFM56-5B',
          testDate: '2024-01-22',
          testBenchNumber: 'TB-A003'
        },
        {
          id: 5,
          serialNumber: 'SP2024005',
          engineModel: 'PW1100G',
          testDate: '2024-01-25',
          testBenchNumber: 'TB-B002'
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
  },
  beforeUnmount() {
    // 清理时移除特殊类名
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.remove('fullscreen');
    }
  },
         methods: {
           visualizeData(item) {
             // 跳转到传感器数据可视化页面
             this.$router.push({
               name: 'SensorVisualization',
               params: { id: item.id },
               query: {
                 engineModel: item.engineModel,
                 testDate: item.testDate,
                 testBenchNumber: item.testBenchNumber
               }
             });
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

.page-description {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 16px;
  text-align: center;
}

.page-content {
  padding: 0;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 自定义滚动条样式 */
.page-content::-webkit-scrollbar {
  width: 8px;
}

.page-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.page-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.data-table-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 40px 30px 100px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
}

.table-header {
  text-align: center;
  margin-bottom: 48px;
  position: relative;
}

.table-header::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.table-header h2 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-subtitle {
  margin: 0;
  color: #060708;
  font-size: 20px;
  font-weight: 400;
  opacity: 0.8;
}

.table-wrapper {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(102, 126, 234, 0.1);
  overflow: hidden;
  border: none;
  width: 100%;
  max-width: 100%;
  position: relative;
}

.table-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: none;
  position: relative;
}

.data-table thead::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
}

.data-table th {
  padding: 28px 24px;
  text-align: left;
  font-weight: 700;
  color: white;
  font-size: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
}

.data-table th:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  bottom: 20%;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.data-table td {
  padding: 24px;
  border-bottom: 1px solid #f8f9fa;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 500;
  position: relative;
}

.data-table td:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  bottom: 20%;
  width: 1px;
  background: #f0f0f0;
}

.data-table tbody tr {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.data-table tbody tr:nth-child(even) {
  background: #fafbfc;
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  z-index: 1;
}

.data-table tbody tr:hover td {
  border-color: transparent;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.btn-visualize {
  padding: 14px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}

.btn-visualize::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-visualize:hover::before {
  left: 100%;
}

.btn-visualize:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6c4bb8 100%);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.empty-state {
  text-align: center;
  padding: 60px 40px;
  color: #666;
}

.empty-state h3 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-container {
    width: calc(100vw - 240px);
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 20px;
  }

  .page-header h1 {
    font-size: 24px;
    letter-spacing: 0.5px;
  }

  .header-stats {
    gap: 20px;
  }

  .data-table-container {
    padding: 30px 20px 80px 20px;
    min-height: calc(100vh - 120px);
  }

  .table-header h2 {
    font-size: 28px;
  }

  .table-subtitle {
    font-size: 16px;
  }

  .table-wrapper {
    border-radius: 16px;
  }

  .data-table th {
    font-size: 14px;
    padding: 20px 16px;
  }

  .data-table td {
    font-size: 14px;
    padding: 20px 16px;
  }

  .btn-visualize {
    padding: 10px 20px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .page-container {
    width: 100vw;
    right: 0;
    left: 0;
  }
}
</style>


