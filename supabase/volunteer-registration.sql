-- Volunteer registrations use the existing `public.registrations` table
-- with type = 'Volunteer'. Run this in the Supabase SQL editor if your project
-- was created before volunteer columns existed, or to verify policies.

-- Ensure volunteer-related columns exist (safe to re-run)
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS preferred_roles text[],
  ADD COLUMN IF NOT EXISTS availability_notes text,
  ADD COLUMN IF NOT EXISTS team_or_department text;

-- Public insert policy (anon + authenticated) — skip if already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'registrations'
      AND policyname = 'Anyone can submit a registration'
  ) THEN
    CREATE POLICY "Anyone can submit a registration"
      ON public.registrations
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Admin read policy — requires public.has_role and user_roles from base migration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'registrations'
      AND policyname = 'Admins can view all registrations'
  ) THEN
    CREATE POLICY "Admins can view all registrations"
      ON public.registrations
      FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Example volunteer row (optional smoke test; remove after verifying)
-- INSERT INTO public.registrations (type, full_name, email, team_or_department, preferred_roles, availability_notes)
-- VALUES (
--   'Volunteer',
--   'Test Volunteer',
--   'volunteer@surgevector.ai',
--   'Engineering',
--   ARRAY['Check-in support', 'Demo day logistics'],
--   'Available May 30 morning for demo day setup.'
-- );
