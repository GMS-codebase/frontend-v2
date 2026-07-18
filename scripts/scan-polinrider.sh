#!/usr/bin/env bash
# PolinRider / DPRK supply-chain IOC scanner.
# Exit 1 if any indicator of compromise is found in the working tree.
# Run manually (bash scripts/scan-polinrider.sh) or from a git hook / CI.
set -u

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT" || exit 2
fail=0

note() { echo "  [IOC] $1"; fail=1; }

echo "== PolinRider IOC scan: $ROOT =="

# 1. Git-history spoofer scripts
for f in config.bat temp_auto_push.bat; do
  [ -e "$f" ] && note "history-spoofer script present: $f"
done

# 2. Fake-font loader payload
[ -e public/fonts/REMOVED-MALWARE-PAYLOAD ] && note "loader payload present: public/fonts/REMOVED-MALWARE-PAYLOAD"

# 3. VS Code auto-run task executing arbitrary code on folder open
if [ -f .vscode/tasks.json ]; then
  if grep -Eq '"runOn"[[:space:]]*:[[:space:]]*"folderOpen"' .vscode/tasks.json; then
    note ".vscode/tasks.json has a folderOpen auto-run task"
  fi
  grep -Eq '\.woff2|curl .*\|.*bash|node \./public' .vscode/tasks.json && note ".vscode/tasks.json executes a suspicious command"
fi
if [ -f .vscode/settings.json ]; then
  grep -Eq '"task\.allowAutomaticTasks"[[:space:]]*:[[:space:]]*true' .vscode/settings.json && note "settings.json enables allowAutomaticTasks"
  grep -Eq '"runOn"[[:space:]]*:[[:space:]]*"folderOpen"' .vscode/settings.json && note "settings.json contains a folderOpen auto-run task"
fi

# 4. Known C2 / obfuscator / dead-drop signatures in source (excluding deps & lockfiles)
PAT='default-configuration\.vercel\.app|vscode-[a-z0-9-]*\.vercel\.app|TMfKQEd7TJJa5xNZJZ2Lep838vrzrs7mAP|TXfxHUet9pJVU1BgVkBAbrES4YUc1nGzcG|rmcej%otb%|Cot%3t=shtP|2857687|1111436'
hits=$(grep -rInE "$PAT" \
        --include="*.js" --include="*.mjs" --include="*.cjs" --include="*.ts" --include="*.json" \
        --exclude-dir=node_modules --exclude-dir=.git \
        --exclude=package-lock.json --exclude=pnpm-lock.yaml . 2>/dev/null)
[ -n "$hits" ] && { note "C2/obfuscator signature match:"; echo "$hits" | sed 's/^/      /'; }

# 5. Suspicious tailwind-lookalike packages in manifest
[ -f package.json ] && grep -Eq 'tailwindcss-style-animate|tailwind-mainanimation|tailwind-animation' package.json \
  && note "suspicious tailwind-lookalike dependency in package.json"

if [ "$fail" -eq 0 ]; then echo "OK: no PolinRider indicators found."; else echo "FAIL: indicators found above."; fi
exit "$fail"
