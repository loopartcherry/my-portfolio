import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

// Prisma 7 直连 Postgres 需使用 driver adapter（Docker / 本地 DB）
const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/myportfolio';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('开始执行 seed 脚本...');

  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 创建管理员账号
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {
      password: hashedPassword,
      role: 'admin',
      name: '管理员',
    },
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin',
      name: '管理员',
    },
  });
  console.log('✅ 创建管理员账号:', admin.email);

  // 创建设计师账号
  const designer = await prisma.user.upsert({
    where: { email: 'designer@test.com' },
    update: {
      password: hashedPassword,
      role: 'designer',
      name: '设计师',
    },
    create: {
      email: 'designer@test.com',
      password: hashedPassword,
      role: 'designer',
      name: '设计师',
    },
  });
  console.log('✅ 创建设计师账号:', designer.email);

  // 创建设计师档案（如果不存在）
  await prisma.designer.upsert({
    where: { userId: designer.id },
    update: {},
    create: {
      userId: designer.id,
      specialties: ['Logo设计', 'VI系统', '网站设计'],
      hourlyRate: 200,
      maxCapacity: 5,
      currentLoad: 0,
      rating: 0,
      totalProjects: 0,
      status: 'active',
    },
  });
  console.log('✅ 创建设计师档案');

  // 创建客户账号
  const client = await prisma.user.upsert({
    where: { email: 'client@test.com' },
    update: {
      password: hashedPassword,
      role: 'client',
      name: '客户',
    },
    create: {
      email: 'client@test.com',
      password: hashedPassword,
      role: 'client',
      name: '客户',
    },
  });
  console.log('✅ 创建客户账号:', client.email);

  console.log('\n🎉 Seed 脚本执行完成！');
  console.log('\n测试账号信息：');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('管理员: admin@test.com / password123');
  console.log('设计师: designer@test.com / password123');
  console.log('客户:   client@test.com / password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seed 脚本执行失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
