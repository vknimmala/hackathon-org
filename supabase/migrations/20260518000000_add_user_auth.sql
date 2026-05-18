
-- Add user_id to link auth accounts to their registrations
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS registrations_user_id_idx
  ON public.registrations(user_id);

-- Participants can read their own registration
CREATE POLICY "Users can view own registration"
  ON public.registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Participants can update their own registration
-- Editable fields and status-lock are enforced in application code.
-- See src/config/registration-edit.ts for EDITABLE_STATUSES.
CREATE POLICY "Users can update own registration"
  ON public.registrations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Secure function to claim an existing registration by matching email.
-- Called from the client after sign-in or sign-up so that legacy registrations
-- (submitted before an account existed) are automatically linked.
CREATE OR REPLACE FUNCTION public.claim_registration()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rows_updated integer;
BEGIN
  UPDATE public.registrations
  SET user_id = auth.uid()
  WHERE email = auth.email()
    AND (user_id IS NULL OR user_id = auth.uid());

  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RETURN rows_updated > 0;
END;
$$;
