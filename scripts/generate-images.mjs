#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '../public/images');

// 确保目录存在
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 图片需求配置
const imageRequirements = {
  'about-workshop.jpg': { width: 1920, height: 1080, description: '关于页面 - 工作坊背景图' },
  'about-story.jpg': { width: 1920, height: 1080, description: '关于页面 - 创始人故事配图' },
  'article-tob-visual.jpg': { width: 1600, height: 900, description: '文章配图 - ToB可视化' },
  'article-data-story.jpg': { width: 1600, height: 900, description: '文章配图 - 数据故事' },
  'article-pitch.jpg': { width: 1600, height: 900, description: '文章配图 - 融资BP' },
  'article-dashboard.jpg': { width: 1600, height: 900, description: '文章配图 - 仪表板设计' },
  'avatar.jpg': { width: 400, height: 400, description: '作者头像' },
  'product-ppt.jpg': { width: 1600, height: 900, description: '产品 - PPT模板' },
  'product-design-system.jpg': { width: 1600, height: 900, description: '产品 - 设计系统' },
  'product-toolkit.jpg': { width: 1600, height: 900, description: '产品 - 工具包' },
  'product-course.jpg': { width: 1600, height: 900, description: '产品 - 设计课程' },
};

// 使用placeholder.com API生成图片
async function generateImage(filename, config) {
  const filepath = path.join(imagesDir, filename);
  
  // 如果文件已存在，跳过
  if (fs.existsSync(filepath)) {
    console.log(`✓ 已存在: ${filename}`);
    return true;
  }

  try {
    const url = `https://via.placeholder.com/${config.width}x${config.height}.jpg/666666/ffffff?text=${encodeURIComponent(config.description)}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(filepath, buffer);
      console.log(`✓ 已生成: ${filename}`);
      return true;
    } else {
      console.log(`✗ 生成失败: ${filename} (HTTP ${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`✗ 生成失败: ${filename} - ${error.message}`);
    // 如果placeholder服务不可用，创建一个空的占位文件说明
    const placeholderNote = `# ${filename}\n\n${config.description}\n\n尺寸: ${config.width}x${config.height}\n\n请使用AI图片生成工具生成此图片。\n`;
    fs.writeFileSync(filepath.replace('.jpg', '.txt'), placeholderNote);
    return false;
  }
}

// 主函数
async function main() {
  console.log('开始生成缺失的图片...');
  console.log('='.repeat(60));
  
  let generated = 0;
  for (const [filename, config] of Object.entries(imageRequirements)) {
    const success = await generateImage(filename, config);
    if (success) generated++;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`完成！生成了 ${generated} 张新图片`);
  console.log('\n注意：当前使用placeholder服务生成占位图片');
  console.log('如需使用AI生成真实图片，请使用AI图片生成工具（如DALL-E、Midjourney等）');
  console.log('提示词已保存在 generate-images-prompts.md 文件中');
}

main().catch(console.error);
