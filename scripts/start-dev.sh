#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting dev + test-ui containers..."
docker compose up -d --build

wait_for_port() {
  local port=$1
  local retries=120
  local delay=0.5
  for i in $(seq 1 $retries); do
    if nc -z localhost "$port" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$delay"
  done
  echo "❌ Timed out waiting for port $port"
  exit 1
}

echo "⏳ Waiting for Vite (5173)..."
wait_for_port 5173
echo "⏳ Waiting for Vitest UI (51204)..."
wait_for_port 51204

APP_URL="http://localhost:5173"
TEST_URL="http://localhost:51204"

if command -v open >/dev/null 2>&1; then
  open "$APP_URL"
  open "$TEST_URL"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$APP_URL" >/dev/null 2>&1 || true
  xdg-open "$TEST_URL" >/dev/null 2>&1 || true
else
  echo "🌐 Open these manually:"
  echo "  $APP_URL"
  echo "  $TEST_URL"
fi

echo "✅ Ready! App: $APP_URL | Tests: $TEST_URL"
