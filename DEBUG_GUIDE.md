# 数据统计模块调试指南

## 问题诊断步骤

### 1. 检查后端服务是否运行

打开浏览器控制台（F12），查看是否有以下错误：

- **网络错误（Network Error）**: 后端服务未运行
- **CORS错误**: 后端需要配置CORS
- **404错误**: 接口路径不正确
- **500错误**: 后端代码错误

### 2. 检查后端服务地址

默认后端地址：`http://127.0.0.1:8000`

如果后端运行在其他地址，需要修改 `src/views/DataStats.vue` 中的 `apiBaseUrl`：

```javascript
apiBaseUrl: 'http://127.0.0.1:8000', // 修改为你的后端地址
```

### 3. 检查数据文件路径

根据后端代码，文件路径格式应该是：

**列数据可视化需要的文件：**
- `data/0STATIC1/05IgnLF4/05IgnLF4.csv` (或类似路径)
- `data/0STATIC1/06PREINJA/06PREINJA.csv`
- `data/0STATIC1/09inj1Rate/09inj1Rate.csv`

**行数据可视化需要的文件：**
- `data/0STATIC1/02IgnLF1/02IgnLF1.csv` (或类似路径)
- `data/0STATIC1/06PREINJA/06PREINJA.csv`
- `data/0STATIC1/09inj1Rate/09inj1Rate.csv`

### 4. 测试后端接口

在浏览器中访问以下URL测试后端接口：

1. **测试根接口**: `http://127.0.0.1:8000/`
2. **测试文件树接口**: `http://127.0.0.1:8000/data/tree`
3. **测试数据类型接口**: `http://127.0.0.1:8000/datatypes`

### 5. 检查浏览器控制台日志

打开浏览器控制台（F12 -> Console），查看以下日志：

- `后端服务连接成功` - 表示后端连接正常
- `开始加载文件: xxx` - 表示开始加载文件
- `引擎列表结果: xxx` - 显示获取到的引擎列表
- 任何错误信息都会显示在控制台

### 6. 常见问题解决

#### 问题1: 页面空白，显示"没有可用的图表"

**可能原因：**
- 后端服务未运行
- 数据文件不存在
- 文件路径不正确

**解决方法：**
1. 检查后端服务是否运行：`http://127.0.0.1:8000/`
2. 检查数据文件是否存在
3. 查看浏览器控制台的错误信息

#### 问题2: 显示"CORS错误"

**解决方法：**
在后端代码中添加CORS中间件：

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应指定具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 问题3: 显示"找不到指定的CSV文件"

**可能原因：**
- 文件路径格式不正确
- 文件不在预期位置

**解决方法：**
1. 检查后端 `_get_csv_path` 函数的逻辑
2. 确认文件实际位置
3. 可能需要调整文件名格式

#### 问题4: 显示"获取引擎列表失败"

**可能原因：**
- `/csv/engines` 接口需要 `data_type` 参数，而不是完整路径
- 文件不存在

**解决方法：**
前端代码会自动从文件名提取 `data_type`，如果仍然失败，检查：
1. 文件是否存在于 `data/0STATIC1/` 目录下
2. 后端 `/csv/engines` 接口是否正常工作

### 7. 手动测试接口

使用以下命令测试后端接口（需要先安装 curl 或使用 Postman）：

```bash
# 测试根接口
curl http://127.0.0.1:8000/

# 测试获取数据类型
curl http://127.0.0.1:8000/datatypes

# 测试获取引擎列表（需要根据实际文件名调整）
curl "http://127.0.0.1:8000/csv/engines?data_type=05IgnLF4&file_index=0"

# 测试获取CSV数据（需要根据实际文件名调整）
curl -X POST "http://127.0.0.1:8000/csv/by-file" \
  -H "Content-Type: application/json" \
  -d '{"filename": "0STATIC1/05IgnLF4", "columns": ["1_S1G0000840000000"], "limit": 10, "offset": 0}'
```

### 8. 调试模式

前端代码已添加详细的控制台日志，包括：
- 每个文件的加载过程
- API请求的URL和参数
- 返回的数据结构
- 错误详细信息

打开浏览器控制台即可查看所有调试信息。

## 快速检查清单

- [ ] 后端服务是否运行在 8000 端口
- [ ] 浏览器控制台是否有错误信息
- [ ] 数据文件是否存在
- [ ] 文件路径格式是否正确
- [ ] 后端接口是否正常响应
- [ ] CORS是否已配置



