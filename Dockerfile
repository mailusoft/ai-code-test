# 第一阶段：构建 Vue 项目
FROM node:20-alpine AS build-stage
WORKDIR /app

# 复制依赖配置文件（单独行写注释，避免干扰命令）
COPY package*.json ./
# 安装依赖（国内镜像加速）
RUN npm install --registry=https://registry.npmmirror.com
# 复制所有项目源代码
COPY . .
# 执行打包
RUN npm run build

# 第二阶段：运行项目（Nginx 服务）
FROM nginx:alpine AS production-stage
# 复制构建产物到 Nginx 静态目录
COPY --from=build-stage /app/dist /usr/share/nginx/html
# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 暴露 80 端口
EXPOSE 80
# 启动 Nginx（前台运行）
CMD ["nginx", "-g", "daemon off;"]