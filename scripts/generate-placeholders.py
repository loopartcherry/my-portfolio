#!/usr/bin/env python3
"""
生成简单的彩色占位图片
需要: pip install pillow
"""

import os
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("错误: 请先安装 Pillow 库")
    print("运行: pip install pillow")
    sys.exit(1)

IMAGES_DIR = Path(__file__).parent.parent / "public" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# 配色方案
COLORS = {
    "primary": (255, 107, 53),  # 橙色 #FF6B35
    "secondary": (150, 102, 255),  # 紫色 #9666FF
    "dark": (18, 18, 18),  # 深色背景
    "text": (255, 255, 255),  # 白色文字
}

IMAGE_REQUIREMENTS = {
    "about-workshop.jpg": { "width": 1920, "height": 1080, "label": "About Workshop" },
    "about-story.jpg": { "width": 1920, "height": 1080, "label": "About Story" },
    "article-tob-visual.jpg": { "width": 1600, "height": 900, "label": "ToB Visual" },
    "article-data-story.jpg": { "width": 1600, "height": 900, "label": "Data Story" },
    "article-pitch.jpg": { "width": 1600, "height": 900, "label": "Pitch Deck" },
    "article-dashboard.jpg": { "width": 1600, "height": 900, "label": "Dashboard" },
    "avatar.jpg": { "width": 400, "height": 400, "label": "Avatar" },
    "product-ppt.jpg": { "width": 1600, "height": 900, "label": "PPT Template" },
    "product-design-system.jpg": { "width": 1600, "height": 900, "label": "Design System" },
    "product-toolkit.jpg": { "width": 1600, "height": 900, "label": "Toolkit" },
    "product-course.jpg": { "width": 1600, "height": 900, "label": "Course" },
}

def create_placeholder_image(filename: str, width: int, height: int, label: str) -> bool:
    """创建占位图片"""
    output_path = IMAGES_DIR / filename
    
    # 如果文件已存在，跳过
    if output_path.exists():
        print(f"✓ 已存在: {filename}")
        return True
    
    try:
        # 创建图片
        img = Image.new('RGB', (width, height), color=COLORS["dark"])
        draw = ImageDraw.Draw(img)
        
        # 添加渐变背景（简单版本）
        for y in range(height):
            # 从深色到稍亮的渐变
            r = int(COLORS["dark"][0] + (COLORS["secondary"][0] * 0.1 * (y / height)))
            g = int(COLORS["dark"][1] + (COLORS["secondary"][1] * 0.1 * (y / height)))
            b = int(COLORS["dark"][2] + (COLORS["secondary"][2] * 0.1 * (y / height)))
            draw.line([(0, y), (width, y)], fill=(r, g, b))
        
        # 添加装饰性几何图形
        # 圆形
        circle_size = min(width, height) // 4
        draw.ellipse(
            [(width // 4, height // 4), (width // 4 + circle_size, height // 4 + circle_size)],
            outline=COLORS["primary"],
            width=3
        )
        draw.ellipse(
            [(width * 3 // 4 - circle_size, height * 3 // 4 - circle_size), 
             (width * 3 // 4, height * 3 // 4)],
            outline=COLORS["secondary"],
            width=3
        )
        
        # 添加文字标签
        try:
            # 尝试使用默认字体
            font_size = min(width, height) // 15
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            try:
                # 尝试使用默认字体（其他系统）
                font = ImageFont.load_default()
            except:
                font = None
        
        text = label
        if font:
            # 获取文字大小
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
        else:
            text_width = len(text) * 10
            text_height = 20
        
        # 居中显示文字
        text_x = (width - text_width) // 2
        text_y = (height - text_height) // 2
        
        # 添加文字阴影
        draw.text((text_x + 2, text_y + 2), text, fill=(0, 0, 0, 128), font=font)
        draw.text((text_x, text_y), text, fill=COLORS["text"], font=font)
        
        # 保存图片
        img.save(output_path, 'JPEG', quality=85)
        print(f"✓ 已生成: {filename} ({width}x{height})")
        return True
        
    except Exception as e:
        print(f"✗ 生成失败 {filename}: {e}")
        return False

def main():
    print("生成占位图片...")
    print("=" * 60)
    
    generated = 0
    for filename, config in IMAGE_REQUIREMENTS.items():
        if create_placeholder_image(filename, config["width"], config["height"], config["label"]):
            generated += 1
    
    print("\n" + "=" * 60)
    print(f"完成！生成了 {generated} 张占位图片")
    print("\n注意：这些是简单的占位图片")
    print("如需高质量图片，请使用 generate-images-ai.py 或参考 IMAGE_GENERATION_PROMPTS.md")

if __name__ == "__main__":
    import sys
    main()
