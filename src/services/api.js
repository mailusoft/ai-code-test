// API服务 - 统一管理所有后端接口调用

const API_BASE_URL = '/api' // 通过Vite代理访问后端

// 通用请求函数
async function request(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorData
    try {
      errorData = JSON.parse(errorText)
    } catch {
      errorData = { detail: errorText }
    }
    throw new Error(errorData.detail || `请求失败: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// GET请求
export function get(url, params = {}) {
  const queryString = new URLSearchParams(params).toString()
  const fullUrl = queryString ? `${url}?${queryString}` : url
  return request(fullUrl, { method: 'GET' })
}

// POST请求
export function post(url, data = {}) {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// ============ 数据类型相关接口 ============

// 获取所有数据类型
export function getDataTypes() {
  return get('/datatypes')
}

// 获取指定数据类型的信息
export function getDataTypeInfo(dataType) {
  return get(`/datatypes/${dataType}`)
}

// 获取文件树结构
export function getDataTree(basePath = 'data', maxDepth = 3, includeFiles = true) {
  return get('/data/tree', { base_path: basePath, max_depth: maxDepth, include_files: includeFiles })
}

// ============ CSV数据相关接口 ============

// 按文件名和列名读取CSV数据
export function getCsvByFile(filename, columns, limit = 100, offset = 0) {
  // 确保路径使用 0STATIC1（数字0）而不是 OSTATIC1（字母O）
  // 在API调用前进行路径修正（双重保险）
  let correctedFilename = filename
  if (filename) {
    // 替换路径开头的 OSTATIC1/
    correctedFilename = String(correctedFilename).replace(/^OSTATIC1\//gi, '0STATIC1/')
    // 替换路径中间的 /OSTATIC1/
    correctedFilename = correctedFilename.replace(/\/OSTATIC1\//gi, '/0STATIC1/')
    // 替换 Windows 路径分隔符的 \OSTATIC1\
    correctedFilename = correctedFilename.replace(/\\OSTATIC1\\/gi, '\\0STATIC1\\')
    // 替换路径开头的 OSTATIC1\（Windows路径）
    correctedFilename = correctedFilename.replace(/^OSTATIC1\\/gi, '0STATIC1\\')
    if (correctedFilename !== filename) {
      console.log(`[API] 路径修正: ${filename} -> ${correctedFilename}`)
    }
  }
  
  console.log(`[API] 最终发送的路径: ${correctedFilename}`)
  
  return post('/csv/by-file', {
    filename: correctedFilename,
    columns,
    limit,
    offset
  })
}

// 获取引擎列表
export function getEngines(dataType = 'EOP-Sw', fileIndex = 0) {
  return get('/csv/engines', {
    data_type: dataType,
    file_index: fileIndex
  })
}

// 获取数据统计信息
export function getStatistics(params) {
  return get('/csv/statistics', params)
}

// 获取所有引擎列表（从所有CSV文件中提取）
export async function getAllEngines() {
  try {
    // 获取所有数据类型
    const dataTypes = await getDataTypes()
    const allEngines = new Set()
    const engineInfo = []
    
    // 遍历所有数据类型，获取引擎列表
    for (const dataType of dataTypes) {
      try {
        const result = await getEngines(dataType.name, 0)
        if (result.engines && result.engines.length > 0) {
          result.engines.forEach(engine => {
            if (!allEngines.has(engine)) {
              allEngines.add(engine)
              engineInfo.push({
                engineNumber: engine,
                dataType: dataType.name,
                fileIndex: 0
              })
            }
          })
        }
      } catch (error) {
        console.warn(`获取数据类型 ${dataType.name} 的引擎列表失败:`, error)
      }
    }
    
    return {
      engines: Array.from(allEngines),
      engineInfo: engineInfo,
      count: allEngines.size
    }
  } catch (error) {
    console.error('获取所有引擎列表失败:', error)
    throw error
  }
}

// 通用筛选数据
export function filterData(params) {
  return post('/csv/filter', params)
}

// 按引擎筛选数据
export function filterByEngines(params) {
  return post('/csv/filter-by-engines', params)
}

// 导出所有API函数
export default {
  get,
  post,
  getDataTypes,
  getDataTypeInfo,
  getDataTree,
  getCsvByFile,
  getEngines,
  getAllEngines,
  getStatistics,
  filterData,
  filterByEngines
}

