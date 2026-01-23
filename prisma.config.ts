import 'dotenv/config'
import { defineConfig, env } from "prisma/config";

// 使用环境变量或默认值（仅用于生成客户端，实际使用时需要配置真实的数据库URL）
const databaseUrl = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/mydb";

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl
  }
});
