#!/usr/bin/env bash
# Pripojí ku kontextu Claude Code info o tom, čo robí kolega.
#   session  -> pri štarte session: pull + STATUS + posledný LOG kolegu + môj INBOX
#   prompt   -> pri každom prompte: či kolega pushol niečo nové (bez čakania na sieť)
MODE="${1:-prompt}"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
cd "$ROOT" || exit 0

ME="$(tr -d '[:space:]' < .me 2>/dev/null)"
if [ -z "$ME" ]; then
  echo "TEAM: Chýba súbor .me. Povedz používateľovi, nech spustí ./scripts/setup.sh bruno|matej"
  exit 0
fi
case "$ME" in bruno) MATE=matej ;; matej) MATE=bruno ;; *) MATE="?" ;; esac
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"

if [ "$MODE" = "session" ]; then
  git fetch --quiet origin 2>/dev/null
  if git diff --quiet && git diff --cached --quiet; then
    git pull --rebase --quiet 2>/dev/null && PULLED="áno" || PULLED="nie (vyrieš ručne)"
  else
    PULLED="nie – máš necommitnuté zmeny, sprav: git pull --rebase --autostash"
  fi
  echo "=== TÍM: si $ME, kolega je $MATE, vetva $BRANCH, pull: $PULLED ==="
  echo "--- Posledné commity ---"
  git log --oneline -8 2>/dev/null
  echo "--- STATUS.md ---"
  sed -n '1,40p' STATUS.md 2>/dev/null
  echo "--- Posledné záznamy v team/$MATE/LOG.md ---"
  tail -n 15 "team/$MATE/LOG.md" 2>/dev/null
  echo "--- Nevybavené správy v team/$ME/INBOX.md ---"
  grep -- '- \[ \]' "team/$ME/INBOX.md" 2>/dev/null || echo "(žiadne)"
  exit 0
fi

# prompt: použij výsledok posledného fetchu a nový spusti na pozadí (nulové čakanie)
UPSTREAM="origin/$BRANCH"
if git rev-parse --verify --quiet "$UPSTREAM" >/dev/null; then
  BEHIND="$(git rev-list --count "HEAD..$UPSTREAM" 2>/dev/null)"
  if [ "${BEHIND:-0}" -gt 0 ]; then
    echo "TÍM: Na $UPSTREAM je $BEHIND nových commitov od posledného pullu:"
    git log --oneline "HEAD..$UPSTREAM" | head -10
    echo "Zmenené súbory:"
    git diff --stat "HEAD...$UPSTREAM" | tail -15
    echo "Ak sa ťa to týka, sprav pred úpravami: git pull --rebase --autostash"
    if git diff --name-only "HEAD...$UPSTREAM" | grep -q "team/$ME/INBOX.md"; then
      echo "!!! $MATE ti napísal do INBOX-u. Po pulle si ho prečítaj a povedz to používateľovi."
    fi
  fi
fi
STAMP=".git/.team-last-fetch"
NOW="$(date +%s)"; LAST="$(cat "$STAMP" 2>/dev/null || echo 0)"
if [ $((NOW - LAST)) -gt 60 ]; then
  echo "$NOW" > "$STAMP"
  (git fetch --quiet origin >/dev/null 2>&1 &)
fi
exit 0
