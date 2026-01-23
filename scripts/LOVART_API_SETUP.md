# Lovart API 配置说明

## 快速开始

### 1. 设置 API 密钥

```bash
export LOVART_API_KEY="your-lovart-api-key"
```

### 2. （可选）设置 API 地址

如果 Lovart API 的地址不是默认值，可以设置：

```bash
export LOVART_API_BASE="https://your-lovart-api-endpoint.com/v1"
```

### 3. 运行脚本

```bash
python3 scripts/generate-images-lovart.py
```

## API 格式说明

脚本支持两种常见的 API 格式：

### 格式1: 同步生成（直接返回图片URL）

API 直接返回生成的图片URL：

```json
POST /v1/images/generations
{
  "prompt": "your prompt",
  "width": 1920,
  "height": 1080
}

Response:
{
  "data": [
    {
      "url": "https://..."
    }
  ]
}
```

### 格式2: 异步生成（先提交任务，再轮询结果）

API 先返回任务ID，然后需要轮询获取结果：

```json
POST /v1/images/generations
{
  "prompt": "your prompt",
  "width": 1920,
  "height": 1080
}

Response (202 Accepted):
{
  "task_id": "xxx",
  "status": "pending"
}

GET /v1/tasks/{task_id}

Response:
{
  "status": "completed",
  "result": {
    "url": "https://..."
  }
}
```

## 自定义 API 格式

如果 Lovart API 使用不同的格式，需要修改 `generate-images-lovart.py` 中的以下部分：

1. **API 端点**: 修改 `LOVART_API_BASE` 或请求URL
2. **请求格式**: 修改 `payload` 字典的结构
3. **响应解析**: 修改 `response.json()` 后的数据提取逻辑
4. **认证方式**: 修改 `headers` 中的认证字段

## 常见问题

### Q: 如何获取 Lovart API 密钥？

A: 请访问 Lovart 官网或开发者文档获取 API 密钥。

### Q: API 返回 401 未授权错误？

A: 检查 API 密钥是否正确设置，以及认证头格式是否正确。

### Q: API 返回 404 错误？

A: 检查 API 地址（`LOVART_API_BASE`）是否正确。

### Q: 如何查看实际的 API 请求和响应？

A: 脚本会打印错误信息，包括 HTTP 状态码和响应内容的前200个字符。

## 测试 API 连接

可以先用单个图片测试：

```python
import requests
import os

headers = {
    "Authorization": f"Bearer {os.getenv('LOVART_API_KEY')}",
    "Content-Type": "application/json"
}

payload = {
    "prompt": "test image",
    "width": 512,
    "height": 512
}

response = requests.post(
    "https://api.lovart.ai/v1/images/generations",  # 替换为实际地址
    headers=headers,
    json=payload
)

print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
```

## 需要调整的部分

如果 Lovart API 的格式与脚本中的不同，请根据实际 API 文档修改：

1. **请求端点**: 第 20 行的 `LOVART_API_BASE`
2. **请求体格式**: 第 50-58 行的 `payload` 字典
3. **响应解析**: 第 63-70 行的响应数据提取
4. **异步任务处理**: 第 75-110 行的任务轮询逻辑
