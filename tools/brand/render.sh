#!/bin/sh
# 공유 카드(og-image.png)와 아이콘(apple-touch-icon.png, logo-512.png)을 다시 만듭니다.
# 원본: tools/brand/og-image.html, tools/brand/icon.html
# 필요: macOS + Google Chrome (인터넷 연결 — 글꼴을 불러옵니다)
# 실행: sh tools/brand/render.sh
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PROFILE="$(mktemp -d)"
trap 'rm -rf "$PROFILE"' EXIT

shot() { # 가로 세로 원본.html 결과.png
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-first-run --no-default-browser-check \
    --user-data-dir="$PROFILE" --force-device-scale-factor=1 \
    --window-size="$1,$2" --virtual-time-budget=8000 \
    --screenshot="$4" "file://$HERE/$3"
}

shot 1200 630 og-image.html "$ROOT/og-image.png"
shot 180 180 icon.html "$ROOT/apple-touch-icon.png"
shot 512 512 icon.html "$ROOT/logo-512.png"

sips -g pixelWidth -g pixelHeight "$ROOT/og-image.png" "$ROOT/apple-touch-icon.png" "$ROOT/logo-512.png"
