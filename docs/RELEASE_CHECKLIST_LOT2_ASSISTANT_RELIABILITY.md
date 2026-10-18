# Release checklist — assistant reliability (lot 2)

Scope: early wake-up (`GET /health`), session retries, "waking up" message, pre-existing Do Not Track / GPC opt-out, README and privacy-page updates. Lot 1 (cache headers, CSP without Google Fonts, CV redirect, removed unused images, CI) is already on `main` (`4dc3e29`) and live.

## 1. Git procedure (you run it)

State when this was written: `main` = `origin/main` = `upstream/main` = `4dc3e29`; only lot 2 is uncommitted.

```bash
git fetch --all --prune
git status -sb                                   # expect: main...origin/main, lot-2 files only
git switch -c feature/lot2-assistant-reliability # uncommitted changes travel with you; nothing is lost
git add README.md public/privacy.html src/i18n/I18nProvider.tsx src/components/assistant docs/RELEASE_CHECKLIST_LOT2_ASSISTANT_RELIABILITY.md
git status                                       # nothing else staged (no dist*, no .env, no scratch files)
git commit -m "feat: wake the assistant service early, retry cold starts and explain the wait"
git push -u origin feature/lot2-assistant-reliability
```

Then open a Pull Request into `main`. GitHub Actions (`ci.yml`) and the Netlify Deploy Preview run on it. Merge only after section 2 passes. After the merge:

```bash
git switch main
git pull --ff-only origin main
git branch -d feature/lot2-assistant-reliability
```

If something goes wrong after the merge: `git revert -m 1 <merge-commit>` on a new branch and a new PR; do not rewrite `main`.

## 2. Deploy Preview checklist (the preview must have `VITE_PORTFOLIO_AI_API_URL` — Netlify applies site variables to previews unless a context overrides them)

- [ ] GitHub Actions `CI` is green (tsc ×2, eslint, vitest, build, verify:seo).
- [ ] Home loads; in DevTools → Network, about 2.5 s after load there is exactly one `GET <render-host>/health` (type `fetch`, no body, no cookies, no `Authorization`), and none on a second page load in the same tab session.
- [ ] No CSP message in the console (the policy allows `https://*.onrender.com`). If the API is not on `onrender.com`, add its origin to `connect-src` in `netlify.toml`.
- [ ] Do Not Track: enable "Send a Do Not Track request" (Firefox) or Global Privacy Control (Brave/Firefox) → no `/health` request. The chat still works.
- [ ] Open the chat → status reads "Public portfolio knowledge" (EN) / "Connaissances publiques du portfolio" (FR). Ask one EN and one FR question; answers, sources and suggestions are in the question's language.
- [ ] Privacy page `/privacy.html` shows the new "Service wake-up" section and the 18 October 2026 date.
- [ ] Contact form, WhatsApp button, CV download, `/lab/*`, a 404 URL (`/nope` → 404) still behave as before.

## 3. Real Render cold-start test (do this on the preview, then again on production)

1. In Render, check the instance type. A free instance sleeps after about 15 minutes without traffic.
2. If an UptimeRobot (or cron) monitor is already pinging `/health`, **pause it** for the test, otherwise the service never sleeps.
3. Wait 20 minutes with no traffic to the service. Confirm in the Render logs that it stopped.
4. In a private window, open the preview home page. Start a stopwatch.
5. Expected: the `/health` request is sent at about 2.5 s and the service starts in the background. Open the chat right away:
   - the status goes "Connecting…" → after 4 s "Waking up the service… this can take up to a minute";
   - the session is created without an error message and the status becomes "Public portfolio knowledge" (typically 30–60 s after the first request);
   - the Network tab shows `POST /api/public/session` retried (502/503 or a failed request) until one succeeds.
6. Ask a question. Record: time to first answer, and whether any error appeared.
7. Repeat once with the chat opened later (30 s after load) to see the pre-warm effect: the wait should be shorter.
8. Re-enable the monitor.

Pass criteria: no error shown to the visitor; session ready within 90 s (the session timeout); the user can close the chat during the wait and no further requests are sent.

## 4. Production checklist (after the merge and the Netlify production deploy)

- [ ] `curl -I https://tsinjona.netlify.app/` still shows the CSP, HSTS and the other security headers.
- [ ] `curl -s --compressed https://tsinjona.netlify.app/assets/index-*.js | grep -c tsinjo:assistant-warmed` returns 1 (lot 2 is live).
- [ ] Repeat the sections 2 and 3 checks on the production URL.
- [ ] UptimeRobot monitor: URL `https://<render-service>.onrender.com/health`, interval 5 minutes, alert by e-mail. Confirm the first checks are green.
- [ ] Google Search Console: no new errors on the next crawl.

## 5. Residual risks

- **CORS and network errors look the same to the browser.** A booting host answers 502/503 without CORS headers, which the browser reports as a network failure, so network failures are retried. A permanent CORS misconfiguration would therefore show "Waking up the service…" for about 24 s before the error appears. Retries stop after 4 attempts.
- **Session timeout.** `sessionTimeoutMs` is 90 s. The retries need 24 s of pauses plus the duration of up to four attempts (a unit test checks that four 10-second attempts fit). A host that keeps every attempt hanging for 20 s or more can still hit the timeout; the visitor then gets the normal "Retry connection" button.
- **Asking while the session is being created.** The 90 s stream timeout covers session creation and the answer together. In the rare case where a visitor asks a question with no valid session during a cold start, little time is left for the answer.
- **The early request reaches the hosting provider on every first page view of a session** (IP address, like any request). It is disclosed in the privacy page and skipped for Do Not Track / GPC. There is no cookie or consent banner on the site.
- **Free-tier limits.** A keep-alive ping every 5 minutes uses instance hours; check the monthly quota of the Render plan.
- **The language detector in the API** (`portfolio-ai-api/app/chat.py`) is unchanged; very short messages can still be misdetected. Fixing it needs a Render redeploy.
