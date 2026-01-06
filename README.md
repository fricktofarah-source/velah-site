## Local development

```
npm install
npm run dev
```

## Hydration timezone

Add the `time_zone` column to `hydration_profiles` so reminders can follow each user’s locale:

```
psql … < supabase/add_hydration_timezone.sql
```
