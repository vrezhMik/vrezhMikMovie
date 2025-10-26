#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="$ROOT_DIR/.env.local"

have_key() {
  [[ -f "$ENV_FILE" ]] && grep -Eq "^[[:space:]]*$1=" "$ENV_FILE"
}
prompt_secret() {
  local var="$1" prompt="$2" show="${3:-0}"
  local val=""

  while :; do
    if [[ "$show" == "1" ]]; then

      read -rp "$prompt: " val >&2
    else
      read -rsp "$prompt: " val >&2
    fi
    echo >&2   
    if [[ -n "$val" ]]; then
      break
    fi
    echo "Value cannot be empty." >&2
  done

  printf '%s=%s\n' "$var" "$val"
}

if [[ ! -f "$ENV_FILE" ]]; then
  echo "🔐 No $ENV_FILE found. Let's create it." >&2
  {
    prompt_secret "VITE_TMDB_ACCESS_TOKEN" "Enter VITE_TMDB_ACCESS_TOKEN"
    prompt_secret "VITE_TMDB_API_KEY" "Enter VITE_TMDB_API_KEY" 1
  } > "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  echo "✅ Created $ENV_FILE" >&2
else
  tmp_additions=""
  if ! have_key "VITE_TMDB_ACCESS_TOKEN"; then
    tmp_additions+=$(prompt_secret "VITE_TMDB_ACCESS_TOKEN" "Enter VITE_TMDB_ACCESS_TOKEN")$'\n'
  fi
  if ! have_key "VITE_TMDB_API_KEY"; then
    tmp_additions+=$(prompt_secret "VITE_TMDB_API_KEY" "Enter VITE_TMDB_API_KEY" 1)$'\n'
  fi
  if [[ -n "$tmp_additions" ]]; then
    printf '%s' "$tmp_additions" >> "$ENV_FILE"
    chmod 600 "$ENV_FILE" || true
    echo "✅ Updated $ENV_FILE with missing values" >&2
  fi
fi
command -v docker >/dev/null || { echo "❌ docker not found"; exit 1; }
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
elif docker-compose version >/dev/null 2>&1; then
  COMPOSE="docker-compose"
else
  echo "❌ docker compose not found"
  exit 1
fi
command -v nc >/dev/null || { echo "❌ nc (netcat) not found"; exit 1; }

echo "🚀 Starting dev + test-ui containers..."
$COMPOSE up -d --build

wait_for_port() {
  local port=$1
  local retries=120
  local delay=0.5
  for _ in $(seq 1 $retries); do
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
