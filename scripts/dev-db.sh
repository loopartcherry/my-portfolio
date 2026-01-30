#!/usr/bin/env bash
# 一键启动：Docker Postgres + Prisma 同步 schema + seed
# 使用方式：./scripts/dev-db.sh  或  npm run db:up
# 依赖：本机已安装并运行 Docker（Desktop 或 Engine）
set -e
cd "$(dirname "$0")/.."

if ! command -v docker >/dev/null 2>&1; then
  echo "错误: 未找到 docker 命令。请先安装 Docker 并确保在 PATH 中。" >&2
  echo "  macOS: https://docs.docker.com/desktop/install/mac-install/" >&2
  exit 1
fi

DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
DB_NAME="${DB_NAME:-myportfolio}"
DB_PORT="${DB_PORT:-5432}"
export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@127.0.0.1:${DB_PORT}/${DB_NAME}"

echo ">>> 启动 Postgres (Docker)..."
docker compose up -d db

echo ">>> 等待 Postgres 就绪..."
for i in $(seq 1 30); do
  if docker compose exec -T db pg_isready -U "$DB_USER" >/dev/null 2>&1; then
    echo "    Postgres 已就绪"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "错误: Postgres 启动超时" >&2
    exit 1
  fi
  sleep 1
done

echo ">>> 同步数据库 schema (prisma db push)..."
npx prisma db push

echo ">>> 执行 seed..."
DATABASE_URL="$DATABASE_URL" npx tsx prisma/seed.ts

echo ""
echo "完成。可将以下内容写入 .env 或 .env.local 以持久使用："
echo "  DATABASE_URL=\"${DATABASE_URL}\""
echo ""
echo "使用 ACCOUNTS.md 中的账号登录控制台："
echo "  管理员: admin@test.com / password123  -> /admin/overview"
echo "  设计师: designer@test.com / password123 -> /designer/overview"
echo "  客户:   client@test.com / password123 -> /dashboard/overview"
