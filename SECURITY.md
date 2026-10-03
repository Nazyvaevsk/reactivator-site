# Security and deployment assumptions

The application runs as one Node process behind Caddy. Only Caddy may reach the
application port. The limiter uses the rightmost X-Forwarded-For address that Caddy
supplies; missing/invalid addresses share a bucket. If another proxy is introduced,
review trusted proxy configuration before deployment. See
https://caddyserver.com/docs/caddyfile/directives/reverse_proxy .

Limits per process (all attempts count, including invalid requests):
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
