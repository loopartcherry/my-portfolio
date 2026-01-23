# 图片生成脚本说明

本目录包含用于生成项目所需图片的脚本和提示词文档。

## 缺失的图片列表

项目需要以下图片（共11张）：

1. `about-workshop.jpg` - 关于页面工作坊背景图
2. `about-story.jpg` - 关于页面创始人故事配图
3. `article-tob-visual.jpg` - ToB可视化文章配图
4. `article-data-story.jpg` - 数据故事文章配图
5. `article-pitch.jpg` - 融资BP文章配图
6. `article-dashboard.jpg` - 仪表板设计文章配图
7. `avatar.jpg` - 作者头像
8. `product-ppt.jpg` - PPT模板产品图
9. `product-design-system.jpg` - 设计系统产品图
10. `product-toolkit.jpg` - 工具包产品图
11. `product-course.jpg` - 设计课程产品图

## 方法1: 使用 Lovart API（推荐）

### 前置要求
1. 安装依赖：
```bash
pip install requests pillow
```

2. 获取 Lovart API 密钥：
- 访问 Lovart 官网或开发者文档
- 创建新的 API 密钥

3. 设置环境变量：
```bash
export LOVART_API_KEY="your-lovart-api-key"
```

### 运行脚本
```bash
python3 scripts/generate-images-lovart.py
```

脚本会自动：
- 检查哪些图片缺失
- 使用 Lovart API 生成缺失的图片
- 保存到 `public/images/` 目录

**注意**: 
- 如果 Lovart API 的格式与脚本中的不同，请参考 `LOVART_API_SETUP.md` 进行调整
- 脚本支持同步和异步两种 API 格式

## 方法2: 使用 OpenAI DALL-E API

### 前置要求
1. 安装依赖：
```bash
pip install openai requests pillow
```

2. 获取 OpenAI API 密钥：
- 访问 https://platform.openai.com/api-keys
- 创建新的 API 密钥

3. 设置环境变量：
```bash
export OPENAI_API_KEY="your-api-key-here"
```

### 运行脚本
```bash
python3 scripts/generate-images-ai.py
```

**注意**: DALL-E 3生成每张图片需要费用（约$0.04-0.08/张）

## 方法3: 使用提示词手动生成

如果不想使用API，可以参考 `IMAGE_GENERATION_PROMPTS.md` 中的提示词，手动使用以下工具生成：

- **OpenAI DALL-E**: https://openai.com/dall-e-3
- **Midjourney**: https://www.midjourney.com
- **Stable Diffusion**: https://stability.ai
- **Bing Image Creator**: https://www.bing.com/create

1. 打开 `IMAGE_GENERATION_PROMPTS.md`
2. 复制相应的提示词
3. 在AI图片生成工具中使用
4. 下载生成的图片
5. 重命名并保存到 `public/images/` 目录

## 方法4: 使用简单占位图片（临时方案）

如果需要临时占位图片让项目先运行起来，可以使用：

```bash
python3 scripts/generate-placeholders.py
```

这会生成简单的彩色占位图片。

## 图片规格

- **文章/产品图片**: 1600x900px (16:9)
- **关于页面图片**: 1920x1080px (16:9)
- **头像**: 400x400px (1:1)

## 颜色方案

所有图片应遵循项目的配色方案：
- **主色**: 橙色 (#FF6B35)
- **辅助色**: 紫色 (#9666FF)
- **背景**: 深色主题

## 验证

生成图片后，确保所有文件都在 `public/images/` 目录中：

```bash
ls -la public/images/
```

应该能看到所有11张图片文件。
