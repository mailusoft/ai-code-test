# Vue 应用项目

这是一个基于Vue 3和Vite构建的现代化前端应用框架，包含完整的侧边栏导航系统。

## 项目特性

- 🚀 Vue 3 - 现代化的JavaScript框架
- ⚡ Vite - 快速的构建工具和开发服务器
- 📦 组件化开发
- 🔧 ES6+ 支持
- 🎨 现代化CSS
- 🧭 侧边栏导航 - 五个主要功能模块
- 📱 响应式设计 - 支持移动端访问

## 项目结构

```
├── public/                 # 静态资源目录
│   └── favicon.ico        # 网站图标
├── src/                   # 源码目录
│   ├── assets/           # 静态资源
│   │   └── main.css      # 主样式文件
│   ├── components/       # Vue组件
│   │   ├── Sidebar.vue              # 侧边栏导航组件
│   │   └── HelloWorld.vue           # 示例组件
│   ├── views/            # 页面组件
│   │   ├── DataDisplay.vue          # 数据展示页面
│   │   ├── EngineFilter.vue         # 发动机筛选页面
│   │   ├── DataStats.vue            # 数据统计页面
│   │   ├── ModelRelated.vue         # 模型相关页面
│   │   └── DataManagement.vue       # 数据管理页面
│   ├── router/           # 路由配置
│   │   └── index.js                 # 路由配置文件
│   ├── App.vue          # 根组件
│   └── main.js          # 应用入口文件
├── index.html           # HTML模板
├── vite.config.js       # Vite配置
├── package.json         # 项目配置和依赖
└── README.md           # 项目文档
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
启动开发服务器，默认地址：http://localhost:3000

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 功能模块

应用包含以下五个主要功能模块，可以通过左侧导航栏进行切换：

1. **📊 数据展示模块** (`/data-display`) - 实时数据图表和概览面板
2. **🔍 发动机筛选模块** (`/engine-filter`) - 多条件筛选和过滤工具
3. **📈 数据统计模块** (`/data-stats`) - 统计分析和趋势图表
4. **🔧 模型相关模块** (`/model-related`) - 机器学习模型管理和配置
5. **📋 数据管理模块** (`/data-management`) - 数据导入导出、备份和权限管理

## 开发说明

- 项目使用Vue 3的Composition API风格
- 组件放在`src/components/`目录下
- 样式文件放在`src/assets/`目录下
- 支持热重载，在开发过程中修改代码会自动更新
- 侧边栏支持响应式设计，适配移动端设备

## 技术栈

- **Vue 3**: 现代化JavaScript框架
- **Vue Router 4**: 单页面应用路由管理
- **Vite**: 新一代前端构建工具
- **ES6+**: 现代JavaScript语法支持
- **CSS3**: 现代化样式设计和动画效果

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License
