## Local development

```
npm install
npm run dev
```

## Push notifications

1. Generate VAPID keys. Example:

   ```
   npx web-push generate-vapid-keys
   ```

   Add the public key to `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and keep the private key for your server if/when you send pushes.

2. Provide Supabase credentials in `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
   VAPID_PRIVATE_KEY=...
   PUSH_CRON_SECRET=...
   PUSH_VAPID_SUBJECT=mailto:hello@velahwater.com # optional
   ```

3. Create the `push_subscriptions` table using `supabase/push_subscriptions.sql`.

4. Redeploy. Users can now opt into push notifications, and you can trigger `/api/push/notify` (via Vercel Cron, Supabase Scheduler, etc.) with `{ "intent": "goal" }` for daytime reminders or `{ "intent": "streak" }` near midnight. Include the `x-cron-secret` header if `PUSH_CRON_SECRET` is set.
