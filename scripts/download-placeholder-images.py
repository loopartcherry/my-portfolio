#!/usr/bin/env python3
"""
从网络下载占位图片
使用 Unsplash Source API（无需API密钥）
"""

import os
import sys
from pathlib import Path
import requests
from urllib.parse import urlencode

# 配置
IMAGES_DIR = Path(__file__).parent.parent / "public" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# 图片需求列表
IMAGE_REQUIREMENTS = {
    "about-workshop.jpg": {
        "width": 1920,
        "height": 1080,
        "search": "modern design workshop office",
        "description": "关于页面 - 工作坊背景图"
    },
    "about-story.jpg": {
        "width": 1920,
        "height": 1080,
        "search": "abstract design journey transformation",
        "description": "关于页面 - 创始人故事配图"
    },
    "article-tob-visual.jpg": {
        "width": 1600,
        "height": 900,
        "search": "business presentation data visualization",
        "description": "文章配图 - ToB可视化"
    },
    "article-data-story.jpg": {
        "width": 1600,
        "height": 900,
        "search": "data visualization infographic charts",
        "description": "文章配图 - 数据故事"
    },
    "article-pitch.jpg": {
        "width": 1600,
        "height": 900,
        "search": "pitch deck presentation business",
        "description": "文章配图 - 融资BP"
    },
    "article-dashboard.jpg": {
        "width": 1600,
        "height": 900,
        "search": "dashboard analytics interface",
        "description": "文章配图 - 仪表板设计"
    },
    "avatar.jpg": {
        "width": 400,
        "height": 400,
        "search": "professional portrait designer",
        "description": "作者头像"
    },
    "product-ppt.jpg": {
        "width": 1600,
        "height": 900,
        "search": "powerpoint template presentation",
        "description": "产品 - PPT模板"
    },
    "product-design-system.jpg": {
        "width": 1600,
        "height": 900,
        "search": "design system ui components",
        "description": "产品 - 设计系统"
    },
    "product-toolkit.jpg": {
        "width": 1600,
        "height": 900,
        "search": "design tools toolkit resources",
        "description": "产品 - 工具包"
    },
    "product-course.jpg": {
        "width": 1600,
        "height": 900,
        "search": "online course education learning",
        "description": "产品 - 设计课程"
    },
}

def download_unsplash_image(filename: str, width: int, height: int, search: str) -> bool:
    """从 Unsplash Source API 下载图片"""
    output_path = IMAGES_DIR / filename
    
    # 如果文件已存在，跳过
    if output_path.exists():
        print(f"✓ 已存在: {filename}")
        return True
    
    try:
        # 使用 Unsplash Source API（无需API密钥）
        # 格式: https://source.unsplash.com/{width}x{height}/?{search}
        url = f"https://source.unsplash.com/{width}x{height}/?{search.replace(' ', ',')}"
        
        print(f"正在下载: {filename}...")
        print(f"  来源: Unsplash")
        print(f"  搜索词: {search}")
        
        response = requests.get(url, timeout=30, allow_redirects=True)
        
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print(f"✓ 已保存: {filename} ({width}x{height})")
            return True
        else:
            print(f"✗ 下载失败: {filename} (HTTP {response.status_code})")
            return False
            
    except Exception as e:
        print(f"✗ 下载失败 {filename}: {e}")
        # 如果Unsplash不可用，尝试使用placeholder服务
        try:
            print(f"  尝试使用 placeholder.com 替代...")
            placeholder_url = f"https://via.placeholder.com/{width}x{height}/666666/ffffff?text={filename.split('.')[0]}"
            response = requests.get(placeholder_url, timeout=10)
            if response.status_code == 200:
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                print(f"✓ 已保存占位图片: {filename}")
                return True
        except:
            pass
        return False

def download_pexels_image(filename: str, width: int, height: int, search: str) -> bool:
    """从 Pexels 下载图片（备用方案）"""
    output_path = IMAGES_DIR / filename
    
    if output_path.exists():
        return True
    
    try:
        # 使用 Picsum Photos (Lorem Picsum) - 简单可靠的占位图片服务
        url = f"https://picsum.photos/{width}/{height}?random=1"
        
        response = requests.get(url, timeout=30, allow_redirects=True)
        
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print(f"✓ 已保存: {filename} (使用 Picsum Photos)")
            return True
    except Exception as e:
        print(f"  Picsum备用方案也失败: {e}")
    
    return False

def main():
    print("=" * 60)
    print("从网络下载占位图片")
    print("=" * 60)
    print("使用 Unsplash Source API（无需API密钥）\n")
    
    downloaded = 0
    failed = []
    
    for filename, config in IMAGE_REQUIREMENTS.items():
        success = download_unsplash_image(
            filename, 
            config["width"], 
            config["height"], 
            config["search"]
        )
        
        if success:
            downloaded += 1
        else:
            # 如果Unsplash失败，尝试Picsum备用方案
            print(f"  尝试备用方案...")
            if download_pexels_image(
                filename, 
                config["width"], 
                config["height"], 
                config["search"]
            ):
                downloaded += 1
            else:
                failed.append(filename)
        
        print()  # 空行分隔
    
    print("=" * 60)
    print(f"完成！成功下载了 {downloaded}/{len(IMAGE_REQUIREMENTS)} 张图片")
    
    if failed:
        print(f"\n以下图片下载失败: {', '.join(failed)}")
        print("可以稍后手动下载或使用其他图片替代")
    
    print("\n提示：这些是网络占位图片，建议后续替换为符合项目风格的图片")

if __name__ == "__main__":
    import requests
    main()
