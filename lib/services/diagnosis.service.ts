/**
 * VCMA 诊断计算服务
 */

interface DiagnosisAnswers {
  [questionId: string]: number; // 1-4
}

interface DimensionScores {
  brand: number;    // V1: q1-q4
  tech: number;     // V2: q5-q8
  product: number;  // V3: q9-q12
  data: number;     // V4: q13-q16
}

interface DiagnosisResult {
  totalScore: number;
  level: number;
  levelName: string;
  dimensionScores: DimensionScores;
  percentile?: number;
}

/**
 * 计算诊断得分
 */
export function calculateDiagnosisScore(answers: DiagnosisAnswers): DiagnosisResult {
  // 计算各维度得分
  const brandScore = (answers.q1 || 0) + (answers.q2 || 0) + (answers.q3 || 0) + (answers.q4 || 0);
  const techScore = (answers.q5 || 0) + (answers.q6 || 0) + (answers.q7 || 0) + (answers.q8 || 0);
  const productScore = (answers.q9 || 0) + (answers.q10 || 0) + (answers.q11 || 0) + (answers.q12 || 0);
  const dataScore = (answers.q13 || 0) + (answers.q14 || 0) + (answers.q15 || 0) + (answers.q16 || 0);

  const dimensionScores: DimensionScores = {
    brand: brandScore,
    tech: techScore,
    product: productScore,
    data: dataScore,
  };

  // 计算总分
  const totalScore = brandScore + techScore + productScore + dataScore;

  // 确定等级
  let level: number;
  let levelName: string;

  if (totalScore <= 24) {
    level = 1;
    levelName = '缺失期';
  } else if (totalScore <= 40) {
    level = 2;
    levelName = '初建期';
  } else if (totalScore <= 52) {
    level = 3;
    levelName = '成熟期';
  } else {
    level = 4;
    levelName = '领先期';
  }

  // 计算行业百分位（模拟，实际应从数据库统计）
  const percentile = calculatePercentile(totalScore);

  return {
    totalScore,
    level,
    levelName,
    dimensionScores,
    percentile,
  };
}

/**
 * 计算行业百分位（模拟）
 * 实际应该从数据库中统计同行业企业的得分分布
 */
function calculatePercentile(score: number): number {
  // 模拟数据：假设行业平均分为 35，标准差为 8
  const mean = 35;
  const stdDev = 8;
  
  // 使用正态分布近似计算百分位
  const z = (score - mean) / stdDev;
  
  // 简化的百分位计算（实际应使用正态分布表）
  if (z <= -2) return 5;
  if (z <= -1) return 20;
  if (z <= 0) return 50;
  if (z <= 1) return 80;
  if (z <= 2) return 95;
  return 98;
}

/**
 * 生成诊断建议
 */
export function generateDiagnosisSuggestions(result: DiagnosisResult): {
  weakestDimension: string;
  strongestDimension: string;
  suggestions: Array<{
    dimension: string;
    priority: 'urgent' | 'medium' | 'optimize';
    title: string;
    desc: string;
    budget: string;
    roi: string;
  }>;
} {
  const { dimensionScores } = result;
  
  // 找出最弱和最强维度
  const dimensions = [
    { key: 'brand', name: '品牌可视化', score: dimensionScores.brand },
    { key: 'tech', name: '技术可视化', score: dimensionScores.tech },
    { key: 'product', name: '产品可视化', score: dimensionScores.product },
    { key: 'data', name: '数据可视化', score: dimensionScores.data },
  ];

  const sorted = [...dimensions].sort((a, b) => a.score - b.score);
  const weakestDimension = sorted[0].name;
  const strongestDimension = sorted[sorted.length - 1].name;

  // 生成建议
  const suggestions = dimensions
    .filter((d) => d.score < 12) // 只对得分较低的维度给出建议
    .map((d) => {
      let priority: 'urgent' | 'medium' | 'optimize';
      let title: string;
      let desc: string;
      let budget: string;
      let roi: string;

      if (d.score <= 8) {
        priority = 'urgent';
        if (d.key === 'brand') {
          title = '建立基础VI系统';
          desc = 'Logo+颜色+字体+基础规范';
          budget = '5-8万';
          roi = '200%+';
        } else if (d.key === 'tech') {
          title = '升级技术演示材料';
          desc = '专业PPT模板+架构图库';
          budget = '3-5万';
          roi = '300%+';
        } else if (d.key === 'product') {
          title = '建立产品设计规范';
          desc = 'UI组件库+设计系统';
          budget = '10-15万';
          roi = '150%+';
        } else {
          title = '建立数据可视化看板';
          desc = '优化数据呈现方式';
          budget = '5-8万';
          roi = '200%+';
        }
      } else if (d.score <= 10) {
        priority = 'medium';
        title = `优化${d.name}`;
        desc = '提升专业度和一致性';
        budget = '3-5万';
        roi = '150%+';
      } else {
        priority = 'optimize';
        title = `完善${d.name}`;
        desc = '建立组件库和规范';
        budget = '3-5万';
        roi = '效率提升3倍';
      }

      return {
        dimension: d.name,
        priority,
        title,
        desc,
        budget,
        roi,
      };
    });

  return {
    weakestDimension,
    strongestDimension,
    suggestions,
  };
}
