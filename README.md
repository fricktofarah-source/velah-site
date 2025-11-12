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
4. Add the `time_zone` column to `hydration_profiles` so reminders can follow each user’s locale:

   ```
   psql … < supabase/add_hydration_timezone.sql
   ```

5. Redeploy. Users can now opt into push notifications, and you can trigger `/api/push/notify` (via Vercel Cron, Supabase Scheduler, etc.) with `{ "intent": "goal" }` for daily reminders or `{ "intent": "streak" }` for the streak warning. Include `Authorization: Bearer $PUSH_CRON_SECRET` (or `x-cron-secret`) if the secret is set.
