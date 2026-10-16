---
description: Pošli správu kolegovi (a jeho Claudovi) cez INBOX
argument-hint: "text správy"
---
Kto som, je v `.me`; kolega je ten druhý (bruno/matej).

1. `git pull --rebase --autostash`
2. Pridaj na koniec `team/<kolega>/INBOX.md` riadok:
   `- [ ] <YYYY-MM-DD HH:MM> od <ja>: $ARGUMENTS`
   Ak správa odkazuje na súbory alebo commity, pridaj ich cesty.
3. `git add team/<kolega>/INBOX.md && git commit -m "[<ja>] správa pre <kolega>" && git push`
4. Potvrď jednou vetou. Kolegov Claude to uvidí pri jeho ďalšom prompte.
