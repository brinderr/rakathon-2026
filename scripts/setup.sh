#!/usr/bin/env bash
# Jednorazové nastavenie po naklonovaní:  ./scripts/setup.sh bruno   (alebo matej)
set -e
NAME="$(echo "${1:-}" | tr '[:upper:]' '[:lower:]')"
case "$NAME" in bruno|matej) ;; *) echo "Použitie: ./scripts/setup.sh bruno|matej"; exit 1 ;; esac
cd "$(git rev-parse --show-toplevel)"
echo "$NAME" > .me
chmod +x .claude/hooks/*.sh scripts/*.sh
git config pull.rebase true
git config rebase.autoStash true
echo "Hotovo. Si '$NAME'. Spusti v tomto priečinku: claude"
