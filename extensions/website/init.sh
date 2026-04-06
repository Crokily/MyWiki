#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
npm install
echo "✅ website extension ready. Run 'npm run dev' or 'npm run build'."
