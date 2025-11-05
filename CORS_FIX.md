# CORS 问题修复指南

## 问题说明

前端运行在 `http://localhost:3000`，后端运行在 `http://127.0.0.1:8000`，浏览器将它们视为不同的源，需要后端配置CORS。

## 解决方案

在后端代码（FastAPI）中添加CORS中间件。

### 方法1：在FastAPI主文件中添加（推荐）

在后端代码的开头部分（导入部分之后，创建app之前或之后）添加：

```python
from fastapi.middleware.cors import CORSMiddleware

# 在创建 app 之后添加
app = fastapi.FastAPI(...)

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],  # 允许的前端地址
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*"],  # 允许所有请求头
)
```

### 方法2：如果后端代码已经有CORS配置，检查是否包含前端地址

确保 `allow_origins` 列表包含：
- `http://localhost:3000`
- `http://localhost:3001`（如果前端运行在这个端口）
- `http://127.0.0.1:3000`

### 完整示例代码

```python
import uvicorn
import fastapi
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware  # 添加这行
import pandas as pd
# ... 其他导入

# 创建app
app = fastapi.FastAPI(docs_url=None, redoc_url=None, openapi_version="3.0.3")

# 添加CORS中间件（在创建app之后立即添加）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ... 其他代码保持不变
```

### 修改后重启后端服务

1. 停止当前运行的后端服务（Ctrl+C）
2. 重新启动后端服务
3. 刷新前端页面

## 验证是否修复

1. 打开浏览器控制台
2. 刷新页面
3. 如果CORS错误消失，说明修复成功
4. 如果仍有错误，检查：
   - 后端服务是否重启
   - `allow_origins` 中是否包含正确的前端地址
   - 前端运行的端口号是否匹配

## 临时解决方案（仅用于开发）

如果只想快速测试，可以使用通配符（**不推荐用于生产环境**）：

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源（仅开发环境）
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 注意事项

- 生产环境应该明确指定允许的源，不要使用 `["*"]`
- 确保后端服务已重启，配置才会生效
- 如果使用代理（如nginx），也需要在代理层配置CORS

