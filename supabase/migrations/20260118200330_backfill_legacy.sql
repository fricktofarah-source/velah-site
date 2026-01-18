-- Optional backfill from legacy tables if they exist.

DO $$
BEGIN
  IF to_regclass('public.user_profiles') IS NOT NULL OR to_regclass('public.hydration_profiles') IS NOT NULL THEN
    INSERT INTO public.profiles (
      user_id,
      email,
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      time_zone,
      hydration_goal_ml,
      pref_hydration_reminders,
      pref_delivery_reminders
    )
    SELECT
      u.id,
      u.email,
      u.raw_user_meta_data->>'full_name',
      up.phone,
      up.address_line1,
      up.address_line2,
      COALESCE(up.city, 'Dubai'),
      hp.time_zone,
      COALESCE(hp.goal_ml, 2000),
      COALESCE(up.pref_hydration_reminders, true),
      COALESCE(up.pref_delivery_reminders, true)
    FROM auth.users u
    LEFT JOIN public.user_profiles up ON up.user_id = u.id
    LEFT JOIN public.hydration_profiles hp ON hp.user_id = u.id
    ON CONFLICT (user_id) DO UPDATE
    SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      address_line1 = EXCLUDED.address_line1,
      address_line2 = EXCLUDED.address_line2,
      city = EXCLUDED.city,
      time_zone = EXCLUDED.time_zone,
      hydration_goal_ml = EXCLUDED.hydration_goal_ml,
      pref_hydration_reminders = EXCLUDED.pref_hydration_reminders,
      pref_delivery_reminders = EXCLUDED.pref_delivery_reminders;
  END IF;

  IF to_regclass('public.hydration_entries') IS NOT NULL THEN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'hydration_entries'
        AND column_name = 'intake_ml'
    ) THEN
      EXECUTE '
        INSERT INTO public.hydration_events (user_id, amount_ml, day, logged_at, source, client_event_id)
        SELECT
          user_id,
          intake_ml,
          day,
          COALESCE(logged_at, day::timestamptz),
          COALESCE(source, ''migration''),
          gen_random_uuid()
        FROM public.hydration_entries
      ';
    ELSIF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'hydration_entries'
        AND column_name = 'amount_ml'
    ) THEN
      EXECUTE '
        INSERT INTO public.hydration_events (user_id, amount_ml, day, logged_at, source, client_event_id)
        SELECT
          user_id,
          amount_ml,
          day,
          COALESCE(logged_at, day::timestamptz),
          COALESCE(source, ''migration''),
          gen_random_uuid()
        FROM public.hydration_entries
      ';
    END IF;
  END IF;
END $$;
