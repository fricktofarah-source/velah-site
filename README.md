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
   ```

3. Create the `push_subscriptions` table using `supabase/push_subscriptions.sql`.

4. Redeploy. Users can now opt into push notifications from the subscription manager, and subscriptions are stored in Supabase for later processing.
