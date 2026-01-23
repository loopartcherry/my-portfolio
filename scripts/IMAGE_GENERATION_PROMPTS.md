# 图片生成提示词列表

本文档包含所有需要生成的图片的详细提示词，用于AI图片生成工具（如OpenAI DALL-E、Midjourney、Stable Diffusion等）。

## 使用方法

1. 复制下面的提示词
2. 在AI图片生成工具中使用
3. 保存生成的图片到 `public/images/` 目录
4. 确保文件名与下面的列表一致

---

## 图片列表

### 1. about-workshop.jpg
**尺寸**: 1920x1080  
**用途**: 关于页面 - 工作坊背景图  
**提示词**:
```
A modern minimalist design workshop space, professional designer working on ToB visualization project, clean background, orange (#FF6B35) and purple (#9666FF) accent colors, dark theme, high quality, professional photography style, shallow depth of field, soft lighting
```

### 2. about-story.jpg
**尺寸**: 1920x1080  
**用途**: 关于页面 - 创始人故事配图  
**提示词**:
```
A thoughtful designer's journey from tech to design, abstract visualization of career transformation, purple and orange gradient, modern minimalist style, dark background, geometric shapes, flowing lines, professional illustration, digital art
```

### 3. article-tob-visual.jpg
**尺寸**: 1600x900  
**用途**: 文章配图 - ToB可视化  
**提示词**:
```
ToB enterprise visualization design showcase, professional business presentation, data visualization, clean modern design, orange and purple theme, dashboard mockup, infographic style, minimalist, professional, high quality
```

### 4. article-data-story.jpg
**尺寸**: 1600x900  
**用途**: 文章配图 - 数据故事  
**提示词**:
```
Data visualization storytelling, transforming complex data into clear visual narratives, infographic style, modern design, dark theme, charts and graphs, clean layout, orange and purple accents, professional design
```

### 5. article-pitch.jpg
**尺寸**: 1600x900  
**用途**: 文章配图 - 融资BP  
**提示词**:
```
Professional pitch deck design, investor presentation, business proposal visualization, sleek modern design, orange and purple accents, clean typography, minimalist layout, professional presentation slide, high quality
```

### 6. article-dashboard.jpg
**尺寸**: 1600x900  
**用途**: 文章配图 - 仪表板设计  
**提示词**:
```
Modern dashboard design, data analytics interface, clean UI, professional ToB SaaS dashboard, dark theme with orange and purple accents, charts and metrics, minimalist design, professional mockup, high quality
```

### 7. avatar.jpg
**尺寸**: 400x400  
**用途**: 作者头像  
**提示词**:
```
Professional designer portrait, friendly confident expression, modern style, neutral background, high quality headshot, studio lighting, professional photography, clean background, portrait photography
```

### 8. product-ppt.jpg
**尺寸**: 1600x900  
**用途**: 产品 - PPT模板  
**提示词**:
```
Professional PowerPoint template design for ToB presentations, modern slide design, clean layout, orange (#FF6B35) and purple (#9666FF) color scheme, business presentation template, minimalist design, professional, high quality mockup
```

### 9. product-design-system.jpg
**尺寸**: 1600x900  
**用途**: 产品 - 设计系统  
**提示词**:
```
Design system showcase, component library, UI kit visualization, modern design tokens, orange and purple theme, professional design system mockup, clean interface, component grid, high quality design
```

### 10. product-toolkit.jpg
**尺寸**: 1600x900  
**用途**: 产品 - 工具包  
**提示词**:
```
Data visualization toolkit, design resources, tools and templates collection, modern design, dark theme with orange accents, professional toolkit showcase, clean layout, high quality mockup
```

### 11. product-course.jpg
**尺寸**: 1600x900  
**用途**: 产品 - 设计课程  
**提示词**:
```
Online design course illustration, educational content, ToB visualization training, modern learning interface, professional design, orange and purple theme, clean educational design, course banner, high quality
```

---

## 通用风格要求

所有图片应遵循以下风格指南：
- **配色方案**: 主色调使用橙色 (#FF6B35) 和紫色 (#9666FF)
- **背景**: 深色主题，适合科技和设计场景
- **风格**: 现代简约，专业设计感
- **质量**: 高分辨率，清晰锐利
- **用途**: ToB企业级设计，专业商务风格

---

## 快速生成脚本

如果需要批量生成，可以使用以下Python脚本配合OpenAI DALL-E API：

```python
import openai
from pathlib import Path

openai.api_key = "YOUR_API_KEY"

for filename, config in image_requirements.items():
    response = openai.Image.create(
        prompt=config['prompt'],
        n=1,
        size=f"{config['width']}x{config['height']}"
    )
    # 下载并保存图片
    # ...
```

---

## 替代方案

如果AI生成不可用，可以使用以下替代方案：
1. 使用Unsplash等免费图片库搜索相似图片
2. 使用Figma等设计工具创建占位图
3. 使用占位图片服务（如placeholder.com）临时替代
