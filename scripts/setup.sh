#!/usr/bin/env bash
# Installs everything this studio needs on a fresh cloud machine. Safe to run twice.
# Run from the repo root: bash scripts/setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

EARSHOT_COMMIT=7a7f7c5c70d4a763a1eca4b3666af7c77e313f97   # the version that was reviewed; change only after a new review

[ -d node_modules ] || npm ci --no-audit --no-fund

mkdir -p tools
if [ ! -x tools/whisper-venv/bin/python ]; then
  python3 -m venv tools/whisper-venv
  tools/whisper-venv/bin/pip install -q --upgrade pip
  tools/whisper-venv/bin/pip install -q faster-whisper numpy
fi

if [ ! -x tools/earshot/.venv/bin/python ]; then
  rm -rf tools/earshot
  git clone -q https://github.com/Leonxlnx/earshot.git tools/earshot
  git -C tools/earshot checkout -q "$EARSHOT_COMMIT"
  python3 -m venv tools/earshot/.venv
  tools/earshot/.venv/bin/pip install -q --upgrade pip
  tools/earshot/.venv/bin/pip install -q -e "tools/earshot[mcp]"
fi

echo "video-studio setup done"
