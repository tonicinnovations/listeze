# NOTES — Out-of-scope findings and post-launch items

## v1.1+ deferred items (from LISTEZE_REBUILD_v1.md)
- CRM/MLS integrations (Follow Up Boss, kvCORE, BoomTown)
- iOS/Android wrapper apps
- Voice generation for cold-call scripts (ElevenLabs)
- Custom subdomain per brokerage (`brokerage.listeze.com`)
- Zapier/Make integration
- Affiliate program
- Bulk listing import (CSV upload)
- Listing photo enhancement (sky replacement, twilight)

## Post-launch findings
- 2026-05-06: Supabase Storage bucket `listing-photos` not yet created — photo upload sends base64 directly to API without persisting. Create bucket with 30-day TTL when ready.
- 2026-05-06: Resend domain `send.listeze.com` DNS records added to Vercel — verify status.
- 2026-05-06: ImprovMX configured for root domain email forwarding (support@listeze.com → tbennett89@cox.net).
- 2026-05-06: Supabase email confirmation is OFF — re-enable once custom SMTP (Resend) is configured in Supabase Auth settings.
- 2026-05-06: Google Search Console not yet set up — submit sitemap at https://listeze.com/sitemap.xml.
- 2026-05-06: PostHog and Sentry keys added — verify events are flowing in their dashboards.
- 2026-05-05: Anthropic and ATTOM API keys were exposed in conversation — rotate both.
