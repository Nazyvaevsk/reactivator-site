# Security and deployment assumptions

## Prelaunch hardening (29 October 2026)

See `SECURITY_PRELAUNCH_REVIEW.md` for findings, test results, dependency-version
discrepancy, transfer instructions and release prerequisites. This branch does not
contain the owner's unpublished dependency commit `b682d6b`; do not deploy it alone.

Applications normalize Russian mobile numbers; reject placeholder subscribers,
control characters and filled honeypots; and deduplicate matching contact/request
payloads for 15 minutes. Origin remains a browser cross-site control, not identity.
Do not use it as a bot-authentication mechanism.

Repair uploads use a random client submission ID and a server-issued upload token.
The server binds the token to the normalized application and declared photo count,
enforces indices 0–9 and a 100 MiB aggregate cap, and remembers acknowledged hashes.
Repeated requests do not resend acknowledged text/photos. Ambiguous upstream
delivery blocks automatic retries: the user must contact the owner instead of
creating duplicate notifications. Legacy first submissions remain accepted, but
unbound legacy `sendMessage=false` continuations are intentionally rejected; reload
old browser tabs after deployment. Sessions expire after 15 minutes, are bounded
to 1000 entries, and reset on restart. This assumes ONE Node process; do not scale
to replicas without shared session/limiter state or explicit sticky routing.

JPEG/PNG/WebP are decoded using the existing sharp dependency with a 40-million
pixel limit and five-second processing timeout. SVG and animated/unsupported
formats are rejected. Files are forwarded with a server-selected filename/MIME;
no upload is written to disk. Limits remain 10 MiB per image and 12 MiB per request.
Actual request-body reads have a 15-second deadline; issue bodies are also bounded.
R2 reads are limited to 16 MiB per sheet and a 15-second total read deadline; ZIP
content is bounded at 128 MiB, with a 60-second fetch budget. ZIP entries use STORE
to avoid synchronous compression; flat SVG names and contents remain unchanged.
Validate exceptionally large commercial kits before release; limits return errors,
never partial successful ZIPs. Live R2 sizes were not available in this environment.

The default IP policy still trusts the rightmost X-Forwarded-For from Caddy. Set
`CLIENT_IP_HEADER=x-real-ip` ONLY if the managed ingress is verified to overwrite
that header with the visitor address. Do not select a caller-controlled header.
Missing/invalid metadata now uses only global limits rather than placing all
visitors in a shared three-message bucket. Correct proxy headers, blocked direct
Node access, and two-distinct-client tests are release prerequisites.

The application emits request UUID, UTC time, status and duration only. No raw IP,
PII, upload tokens, signatures, bodies or secrets are logged. Access logs at the
trusted ingress are still needed to investigate visitor IPs. Do not dump env files,
Docker inspect output or signed URLs into support tickets.

## Original deployment contract (read with the amendments above)

The application runs as one Node process behind Caddy. Only Caddy may reach the
application port. The limiter uses the rightmost X-Forwarded-For address that Caddy
supplies; missing/invalid addresses share a bucket. If another proxy is introduced,
review trusted proxy configuration before deployment. See
https://caddyserver.com/docs/caddyfile/directives/reverse_proxy .

Limits per process (upload attempts after the Origin check count, including invalid
bodies; the message limiter runs only for new valid text submissions):
- Telegram: 30 uploads per IP / 10 minutes, 300 overall; 3 new messages per IP /
  10 minutes, 60 overall. Up to ten photos per application remain supported.
- Sheets: 120 per IP / minute, 1200 overall, 16 simultaneous requests.
- ZIP: 5 per IP / 10 minutes, 50 overall, 2 simultaneous requests.
- Issue POST: 30 per IP / 10 minutes, 300 overall.
- Telegram: at most 8 simultaneous submissions; relay timeout 20 seconds.
Responses use 429, Retry-After and no-store. State is bounded to 10000 buckets,
expires automatically and resets on restart. Replicas require a shared limiter;
these controls do not replace upstream DDoS protection. IPv6 address rotation and
shared NAT addresses remain limitations. Global caps protect against IP rotation.

Customer links retain their 24-hour signature contract and query parameters for
compatibility. The viewer sends signatures in Authorization for sheets and ZIPs;
old direct API links continue working. Private pages/API use no-referrer/no-store
and noindex. Analytics is already excluded on direct access page loads.
Initial legacy link requests still contain a signature in their URL, browser
history and potentially reverse-proxy logs. Configure Caddy/Timeweb logging to
omit or redact query strings on /body-dimensions/access and /api/body-dimensions/*.
Never log Authorization, request bodies or signed URLs. Existing historical logs
are outside this code change. Previously loaded analytics during SPA navigation
may persist; open private links as full-page navigations.

Master issue tokens are reusable for seven days, bound to group and master chat,
signed with a separate secret, carried in a fragment and posted in a bounded body.
Reopening the original Telegram link allows reissuance until expiry. Each issue
creates a 24-hour customer link; old customer links keep their original expiry.
Possession of the master token permits issuance: keep it private. Individual
revocation needs persistent state; secret rotation invalidates all master tokens.

SVG served by this app has sandbox/default-src none CSP, inline styles only and
nosniff. ZIP-extracted SVG and objects served directly from R2 are outside these
HTTP headers. Public R2 previews and existing analytics remain compatible.
The main-site CSP blocks objects, foreign base URLs and cross-origin framing;
it is intentionally not a strict script CSP. HSTS remains a TLS proxy concern.

No .env values were read or printed by the audit. Next build loads environment
configuration internally as usual. Live production/Caddy settings and real
Telegram/R2 operations must be checked separately after deployment.
